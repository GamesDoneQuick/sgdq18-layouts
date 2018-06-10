'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// Packages
const RequestPromise = require("request-promise");
const WebSocket = require("ws");
const cheerio = require("cheerio");
// Ours
const nodecgApiContext = require("./util/nodecg-api-context");
const nodecg = nodecgApiContext.get();
const log = new nodecg.Logger(`${nodecg.bundleName}:oot-bingo`);
const request = RequestPromise.defaults({ jar: true }); // <= Automatically saves and re-uses cookies.
const ROOM_ID = '6rL_Y6SsTKKoiDxUmP-fbQ';
const SOCKET_KEY_REGEX = /temporarySocketKey\s+=\s+"(\S+)"/;
request({
    uri: `https://bingosync.com/room/${ROOM_ID}/board`,
    json: true
}).then(result => {
    log.info(result);
    /*
    [
        {
            "slot": "slot1",
            "colors": "blank",
            "name": "All 5 Lake Hylia Skulltulas"
        },
        {
            "slot": "slot2",
            "colors": "blank",
            "name": "Map & Compass in Forest Temple"
        },
        {
            "slot": "slot3",
            "colors": "blank",
            "name": "Zora Tunic"
        },
        {
            "slot": "slot4",
            "colors": "blank",
            "name": "Bronze Gauntlets"
        },
        {
            "slot": "slot5",
            "colors": "blank",
            "name": "All 5 Skulltulas in Water Temple"
        },
        {
            "slot": "slot6",
            "colors": "blank",
            "name": "Beat the Forest Temple"
        },
        {
            "slot": "slot7",
            "colors": "blank",
            "name": "All 3 Elemental Arrows"
        },
        {
            "slot": "slot8",
            "colors": "blank",
            "name": "Din's Fire"
        },
        {
            "slot": "slot9",
            "colors": "blank",
            "name": "7 Different Unused Keys in Gerudo Training Grounds"
        },
        {
            "slot": "slot10",
            "colors": "blank",
            "name": "3 Tunics"
        },
        {
            "slot": "slot11",
            "colors": "blank",
            "name": "Megaton Hammer"
        },
        {
            "slot": "slot12",
            "colors": "blank",
            "name": "Defeat a Skull Kid"
        },
        {
            "slot": "slot13",
            "colors": "blank",
            "name": "1 Skulltula from each Child Dungeon"
        },
        {
            "slot": "slot14",
            "colors": "blank",
            "name": "All 5 Skulltulas in Shadow Temple"
        },
        {
            "slot": "slot15",
            "colors": "blank",
            "name": "All 5 Skulltulas in Spirit Temple"
        },
        {
            "slot": "slot16",
            "colors": "blank",
            "name": "Two Fairy Spells"
        },
        {
            "slot": "slot17",
            "colors": "blank",
            "name": "Blue Gauntlets"
        },
        {
            "slot": "slot18",
            "colors": "blank",
            "name": "Defeat Volvagia"
        },
        {
            "slot": "slot19",
            "colors": "blank",
            "name": "Exactly 30 Deku Sticks"
        },
        {
            "slot": "slot20",
            "colors": "blank",
            "name": "All 5 Skulltulas in Dodongo's Cavern"
        },
        {
            "slot": "slot21",
            "colors": "blank",
            "name": "Ganon's Castle Boss Key"
        },
        {
            "slot": "slot22",
            "colors": "blank",
            "name": "500 Rupees"
        },
        {
            "slot": "slot23",
            "colors": "blank",
            "name": "Defeat Twinrova"
        },
        {
            "slot": "slot24",
            "colors": "blank",
            "name": "7 Maps"
        },
        {
            "slot": "slot25",
            "colors": "blank",
            "name": "Get to the end of Fire Trial"
        }
    ]
     */
});
const ROOM_URL = `https://bingosync.com/room/${ROOM_ID}`;
const ROOM_PASSWORD = 'gdq';
init().then(() => {
    log.info('init success');
}).catch(error => {
    log.error(error);
});
async function init() {
    let $ = await request({
        uri: ROOM_URL,
        transform(body) {
            return cheerio.load(body);
        }
    });
    // If input[name="csrfmiddlewaretoken"] exists on the page, then we must be on the "Join Room" form.
    // Else, we must be in the actual game room.
    const csrfTokenInput = $('input[name="csrfmiddlewaretoken"]');
    if (csrfTokenInput) {
        const formData = {
            room_name: $('input[name="room_name"]').val(),
            encoded_room_uuid: $('input[name="encoded_room_uuid"]').val(),
            creator_name: $('input[name="creator_name"]').val(),
            game_name: $('input[name="game_name"]').val(),
            player_name: 'NodeCG',
            passphrase: ROOM_PASSWORD,
            csrfmiddlewaretoken: csrfTokenInput.val()
        };
        // POST to join the room.
        const postResponse = await request({
            method: 'POST',
            uri: ROOM_URL,
            form: formData,
            headers: {
                Referer: ROOM_URL
            },
            resolveWithFullResponse: true,
            simple: false
        });
        console.log('formDate:', formData);
        console.log('body:', postResponse.body);
        console.log('statuscode:', postResponse.statusCode);
        // Request the room page again, so that we can extract the socket token from it.
        $ = await request({
            uri: ROOM_URL,
            transform(body) {
                return cheerio.load(body);
            }
        });
    }
    // Socket stuff
    const bodyHtml = $.html();
    //console.log(bodyHtml);
    const matches = bodyHtml.match(SOCKET_KEY_REGEX);
    if (!matches) {
        log.error('Socket key not found on page.');
        return;
    }
    console.log(matches);
    const socketKey = matches[1];
    if (!socketKey) {
        log.error('Socket key not found on page.');
        return;
    }
    const chatSocket = new WebSocket('wss://sockets.bingosync.com/broadcast');
    chatSocket.onopen = () => {
        log.info('socket opened!');
        chatSocket.send(JSON.stringify({ socket_key: socketKey }));
    };
    chatSocket.onmessage = (evt) => {
        const json = JSON.parse(evt.data);
        log.info('socket message:', json);
    };
    chatSocket.onclose = () => {
        log.info('socket closed.');
    };
}
//# sourceMappingURL=oot-bingo.js.map