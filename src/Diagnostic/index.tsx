import React, {useEffect, useState} from "react";
import {EspLoader} from "@toit/esptool.js";
import {Button, ProgressBar, Select} from "react-materialize";
import {sleep} from "@toit/esptool.js/build/util";

export interface IDiagnosticProps {

}

type TProduct = "eom3k" | "m1k";

interface IFirmwareVersion {
    version: string;
    partitionURL: string | undefined;
    binaryURL: string | undefined;
}

interface IFirmwareBinaryData {
    partitionBin: Uint8Array;
    firmwareBin: Uint8Array;
}

interface IPartition {
    name: string;
    data: Uint8Array;
    offset: number;
}

interface IGithubAPIReleaseAsset {
    url: string;
    id: number;
    name: string;
    label: string;
    size: number;
    browser_download_url: string;
}

interface IGitHubAPIRelease {
    url: string;
    assets_url: string;
    html_url: string;
    id: number;
    tag_name: string;
    draft: boolean;
    prerelease: boolean;
    created_at: string;
    published_at: string;
    assets: IGithubAPIReleaseAsset[];
}

async function fetchFirmwareVersions(product: TProduct) : Promise<IFirmwareVersion[]> {
    switch (product) {
        case "eom3k":
            const releases = await fetch("https://api.github.com/repos/MausTec/edge-o-matic-3000/releases");
            const json = await releases.json();

            return json.map((release: IGitHubAPIRelease) : IFirmwareVersion => ({
                version: release.tag_name,
                partitionURL: `https://us-central1-maustec-io.cloudfunctions.net/gh-release-embedded-bridge/${release.id}/update.partitions.bin`,
                binaryURL: `https://us-central1-maustec-io.cloudfunctions.net/gh-release-embedded-bridge/${release.id}/update.bin`
            }));

        case "m1k":
            return [];
    }
}

async function fetchSerialPorts() : Promise<SerialPort> {
    if (typeof navigator.serial === 'undefined') {
        throw "Not supported.";
    }

    return await navigator.serial.requestPort();
}

async function fetchFirmwareBinaries(versionData: IFirmwareVersion) : Promise<IFirmwareBinaryData> {
    if (!versionData.partitionURL || !versionData.binaryURL) {
        throw "Incomplete version data.";
    }

    const pbin = await fetch(versionData.partitionURL);
    const dbin = await fetch(versionData.binaryURL);

    console.log(versionData.binaryURL);

    const pbinData = await pbin.arrayBuffer();
    const dbinData = await dbin.arrayBuffer();

    return {
        partitionBin: new Uint8Array(pbinData),
        firmwareBin: new Uint8Array(dbinData)
    };
}

async function flashFirmware(port: SerialPort, versionData: IFirmwareVersion, progressCb: ((progress: number) => void)) {
    const data = await fetchFirmwareBinaries(versionData);

    const partitions: IPartition[] = [
        {
            name: "partitions",
            offset: 0x8000,
            data: data.partitionBin
        },
        {
            name: "otadata",
            offset: 0xe000,
            data: new Uint8Array(0x2000),
        },
        {
            name: "ota0",
            offset: 0x10000,
            data: data.firmwareBin
        }
    ];

    console.log(partitions);

    await port.open({ baudRate: 115200 });

    try {
        const loader = new EspLoader(port, { debug: true, logger: console });
        await loader.connect();

        try {
            const chipName = await loader.chipName();
            const macAddr = await loader.macAddr();
            await loader.loadStub();
            await loader.setBaudRate(115200, 921600);

            for (let i = 0; i < partitions.length; i++) {
                await loader.flashData(partitions[i].data, partitions[i].offset, function (idx, cnt) {
                    // options.progressCallback(partitions[i].name, idx, cnt);
                    progressCb(idx);
                    console.log({ idx, cnt });
                });
                await sleep(100);
            }
        } finally {
            await loader.flashFinish(true);
            await loader.disconnect();
        }
    } finally {
        await port.close();
    }
}

const Diagnostic : React.FC<IDiagnosticProps> = () => {
    const [port, setPort] = useState<SerialPort|null>(null);
    const [product, setProduct] = useState<TProduct|null>("eom3k");
    const [versions, setVersions] = useState<IFirmwareVersion[]>([]);
    const [currentVersion, setCurrentVersion] = useState<string>("");
    const [flashProgress, setFlashProgress] = useState<number>(-1);

    useEffect(() => {
        if (!product) return;
        fetchFirmwareVersions(product).then(setVersions);
    }, []);

    const handlePortRequest = (e: React.MouseEvent) => {
        e.preventDefault();
        fetchSerialPorts().then(setPort);
    }

    const handleVersionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentVersion(e.target.value);
    }

    const handleFlashStart = (e: React.MouseEvent) => {
        e.preventDefault();
        const v = versions.find(x => x.version === currentVersion);

        if (v && port) {
            try {
                setFlashProgress(0);
                flashFirmware(port, v, (progress) => {
                    setFlashProgress(progress);
                }).then(() => {
                    console.log("DONE");
                    setFlashProgress(100);
                });
            } catch(e) {
                console.error(e);
            }
        }
    }

    const handleDisconnect = (e: React.MouseEvent) => {
        e.preventDefault();
        setPort(null);
        setFlashProgress(-1);
    }

    return (
        <div className={'full-splash'} style={{minHeight: '100vh', position: 'relative', padding: '1px'}}>
            <div className={"form"} style={{
                display: 'block',
                margin: '100px auto',
                width: 350
            }}>
                <div className={"card"}>
                    <div className={"card-content"}>
                        <div className={"card-title"}>Select port:</div>
                        <Button onClick={handlePortRequest} disabled={!!port}>Connect...</Button>
                    </div>
                </div>

                { port && <div className={"card"}>
                    <div className={"card-content"}>
                        <div className={"card-title"}>Select version:</div>
                        <Select onChange={handleVersionSelect} value={currentVersion}>
                            {/*{ versions.length === 0 && <option disabled>Loading...</option> }*/}
                            <option disabled key={-1} value={""}>Select a Version...</option>
                            { versions.map(version =>
                                <option key={version.version} value={version.version}>
                                    { version.version }
                                </option>) }
                        </Select>
                    </div>
                </div>}

                {currentVersion && <div className={"card"}>
                    <div className={"card-content"}>
                        <div className={"card-title"}>Flash Firmware:</div>
                        <Button onClick={handleFlashStart} disabled={flashProgress>=0||!port}>Flash Firmware</Button>
                        <div style={{marginTop: "1.5rem"}}>
                            <ProgressBar progress={flashProgress} />
                        </div>
                    </div>
                </div> }

                {flashProgress === 100 && <div className={"card"}>
                    <div className={"card-content"}>
                        <div className={"card-title"}>Flash Complete.</div>
                        <Button onClick={handleDisconnect}>Disconnect</Button>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default Diagnostic;