//% color=190 weight=100 icon="\uf4d8" block="SW07"
namespace SW07
{
    let ADC_I2C_ADDRESS = 0x59
    let ADC_REG_CONF = 0x02
    let ADC_CONF_CYC_TIME_256 = 0x80
    let ADC_REG_RESULT = 0x00
    let voltage = 0.0
    

    function init(): void
    {
        setreg(ADC_REG_CONF, ADC_CONF_CYC_TIME_256)
    }

    function getUInt16BE(reg: number): number {
        pins.i2cWriteNumber(ADC_I2C_ADDRESS, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(ADC_I2C_ADDRESS, NumberFormat.UInt16BE);
    }

    function readVoltage()
    {
        let data: NumberFormat.UInt16LE;
        let a: NumberFormat.UInt8LE
        let b: NumberFormat.UInt8LE

	    data = getUInt16BE(ADC_REG_RESULT)

	    a = (data & 0xFF00) >> 8
	    b = (data & 0x00FF) >> 0

	    voltage = ((((a & 0x0F)*256) + (b & 0xF0))/0x10)*(3.3/256);
    }

    function getVoltage()
    {
        readVoltage()
        return voltage
    }

    function setreg(reg: number, dat: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(ADC_I2C_ADDRESS, buf);
    }

    //% blockId=getMoisture 
    //% block="SW07 get moisture"
    export function getMoisture(): number
    {
        let value = getVoltage()
        return Math.map(value, 0, 2.63, 0, 100)
    }

    init()
}