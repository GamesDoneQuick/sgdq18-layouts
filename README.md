# sgdq18-layouts [![Build status](https://ci.appveyor.com/api/projects/status/dvcth5b511s4ksob/branch/master?svg=true)](https://ci.appveyor.com/project/supportclass/sgdq18-layouts/branch/master)

> The on-stream graphics used during Summer Games Done Quick 2018.

This is a [NodeCG](http://github.com/nodecg/nodecg) v0.9 bundle. You will need to have NodeCG v0.9 installed to run it.

## Table of Contents
- [Video Breakdown](#video-breakdown)
- [Automated Builds](#automated-builds)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Setting up OBS](#setting-up-obs)
- [Usage](#usage)
  - [Running a mock donation server](#running-a-mock-donation-server)
  - [Lightning Round](#lightning-round)
- [License](#license)
- [Credits](#credits)

## Video Breakdown
We unfortunately do not have time to make a video breakdown for this event's bundle. However, [we did make one for the last year's SGDQ](https://www.youtube.com/watch?v=vBAZXchbI3U&list=PLTEhlYdONYxv1wk2FsIpEz92X3x2E7bSx), which still has a few similarities with this one.

## Automated Builds
If you are using an automated build (which includes everything in one zip file with a single exe), skip to [Setting up OBS](#setting-up-obs).

## Requirements
- [Node.js v7 or greater (v8 recommended)](https://nodejs.org/)
- [NodeCG v0.9.x](https://github.com/nodecg/nodecg/releases)

## Installation
1. Install to `nodecg/bundles/sgdq18-layouts`.
2. Install `bower` if you have not already (`npm install -g bower`)
3. Install a compiler toolchain:
	- **WINDOWS**: Install [`windows-build-tools`](https://www.npmjs.com/package/windows-build-tools) to install the tools necessary to compile `sgdq18-layouts`' dependencies.
	- **LINUX**: Install `build-essential` and Python 2.7, which are needed to compile `sgdq18-layouts`' dependencies.
4. `cd nodecg/bundles/sgdq18-layouts` and run `npm install --production`, then `bower install`
5. Create the configuration file (see the [configuration](#configuration) section below for more details)
6. Run the nodecg server: `node index.js` (or `nodecg start` if you have [`nodecg-cli`](https://github.com/nodecg/nodecg-cli) installed) from the `nodecg` root directory.

**Please note that by default, not all graphics will not work.** This is because `sgdq18-layouts` makes use of several non-free plugins for [GSAP](https://greensock.com), which we cannot redistribute. If you wish to use all graphics in their current implementations, you will need to pay for access to [Club GreenSock](https://greensock.com/club) and save the following plugins to the following directories:
- [SplitText](https://greensock.com/SplitText): `shared/lib/vendor/SplitText.min.js`
- [CustomEase](https://greensock.com/customease): `shared/lib/vendor/CustomEase.min.js`
- [DrawSVGPlugin](https://greensock.com/drawSVG): `shared/lib/vendor/DrawSVGPlugin.min.js`

### Running a mock donation server
`sgdq18-layouts` listens for donations in realtime, rather than polling the donation tracker for a new donation total. To facilitate testing,
we provide a small script that sends mock donations:

1. Add `"donationSocketUrl": "http://localhost:22341"` to your `nodecg/cfg/sgdq18-layouts.json`
2. From the `nodecg/bundles/sgdq18-layouts` folder, run `npm run mock-donations`
3. Run NodeCG (`nodecg start` or `node index.js` from the `nodecg` folder)

In production, you'd use [TipoftheHats/donation-socket-repeater](https://github.com/TipoftheHats/donation-socket-repeater) along with the "Postback URL" feature of [GamesDoneQuick/donation-tracker](https://github.com/GamesDoneQuick/donation-tracker).

### Lightning Round
[Lightning Round](https://github.com/GamesDoneQuick/lightning-round) is GDQ's system for gathering interview questions from Twitter. It exists in two parts: one part running "in the cloud" as a Firebase app, and one part running locally as part of this NodeCG bundle.

Lightning Round is pretty weird and kind of difficult to set up. You can watch these videos for more information but please bear in mind that they are outdated, as they were made for SGDQ 2017, not SGDQ 2018:
- [Lightning Round Overview](https://www.youtube.com/watch?v=-qzIfS7KxCQ&index=4&list=PLTEhlYdONYxv1wk2FsIpEz92X3x2E7bSx)
- [Lightning Round Setup Guide](https://www.youtube.com/watch?v=Uz_99-bJzyc&index=12&list=PLTEhlYdONYxv1wk2FsIpEz92X3x2E7bSx)

## Configuration
To configure this bundle, create and edit `nodecg/cfg/sgdq18-layouts.json`.  
Refer to [configschema.json](configschema.json) for the structure of this file.

If you have [nodecg-cli](https://github.com/nodecg/nodecg-cli) installed, you can run `nodecg defaultconfig` from the `nodecg/bundles/sgdq18-layouts/` folder to generate a `cfg/sgdq18-layouts.json` file with default values derived from the schema.

## Setting up OBS
`sgdq18-layouts` has a deep, complex integration with OBS Studio. As such, it expects your OBS to be fairly precisely configured.

1. Download and extract [this custom build of OBS](https://www.dropbox.com/s/ql8y1ehcvbolzvq/SGDQ-OBS-8d0d90c.zip?dl=1), which includes a custom build of `obs-browser` which uses CEF 3029.  
   	- Once extracted, OBS can be launched via `bin/64bit/obs64.exe`.  
2. Go to "Profile > Import", and import the `obs-assets/obs-profile` directory from this repository. Then, ensure that the "SGDQ2018" profile is selected in OBS.  
3. Go to "Scene Collection > Import", and import the `obs-assets/obs-scenes.json` file from this repository. Then, ensure that the "SGDQ2018 - Localhost" scene collection is selected in OBS.  
4. Locate the "Scene Transitions" dropdown menu in the main interface of OBS (it will be near the bottom right by default). Select "Blank Stinger". Click the gear icon below the dropdown, and select "Properties". Update the "Video File" path to point to your `sgdq18-layouts/obs-assets/BlankTransition.mov` path. 

## Usage
This bundle is not intended to be used verbatim. Some of the assets have been replaced with placeholders, and most of the data sources are hardcoded. We are open-sourcing this bundle in hopes that people will use it as a learning tool and base to build from, rather than just taking and using it wholesale in their own productions.

To reiterate, please don't just download and use this bundle as-is. Build something new from it.

1. Start NodeCG
	```bash
	# From the `nodecg` dir:
	node index.js
	```
	- If you're using an automated build, just run `nodecg.exe`.
2. Open [http://localhost:9090](http://localhost:9090)
3. Click on the "Setup" tab of the dashboard, and connect to OBS using the "OBS" panel.
	- By default, `obs-websocket` uses port 4444 and has no password.
	- The `1` tab is for the "compositor" OBS, where the graphics are running.
	- The `2` tab is for the "recording" OBS, where the primary recordings are running.
		- You do not need to have `2` connected, it is optional.

## License
sgdq18-layouts is provided under the Apache v2 license, which is available to read in the [LICENSE](LICENSE) file.

## Credits
Designed & developed by [Support Class](http://supportclass.net/)
 - [Alex "Lange" Van Camp](https://twitter.com/VanCamp/)  
 - [Chris Hanel](https://twitter.com/ChrisHanel)
