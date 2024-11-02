export async function connectSerial(setDataPoint, setGaugeData) {
    const port = await navigator.serial
        .requestPort()
        .then((port) => {
            console.log(port);
            return port;
        });
    await port.open({ baudRate: 9600 });

    const textDecoder = new TextDecoderStream();
    // const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        // Process `value` here and update state to render in React
        setDataPoint(value);
        setGaugeData(value);
    }
}