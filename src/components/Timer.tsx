import { useState, useEffect } from "react"
import { TimerProps } from "../Models"

const Timer: React.FC<TimerProps> = ({ seconds, handleTimerEnd }) => {
    const [time, setTime] = useState(seconds ?? 0)

    useEffect(() => {
        let interval: any
        if (seconds) {
            interval = setInterval(() => {
                setTime((prevTime) => {
                    if (prevTime > 0) {
                        return prevTime - 1
                    } else {
                        setTimeout(() => {
                            handleTimerEnd()
                        }, 0)
                        clearInterval(interval)
                        return 0
                    }
                })
            }, 1000)
        }

        return () => clearInterval(interval)
    }, [handleTimerEnd])

    const pad = (num: number) => {
        return num.toString().padStart(2, "0")
    }

    return (
        <>
            {typeof time === "number" ? (
                <div
                    className={`${
                        time > 59 ? "text-gray-700" : "text-red-700"
                    } font-graduate bg-gray-300/90 rounded-xl flex flex-row justify-center items-center`}>
                    {time > 86400 ? (
                        <div className="flex flex-col items-center justify-center w-28">
                            <div className="text-[3vh]">{pad(Math.floor(time / 86400 < 100 ? time / 86400 : 99))}</div>
                            <div className="text-[1rem] leading-6">days</div>
                        </div>
                    ) : null}
                    {time > 3600 ? (
                        <div className="flex flex-col items-center justify-center w-28">
                            <div className="text-[3vh]">{pad(Math.floor(((time ?? 0) % 86400) / 3600))}</div>
                            <div className="text-[1rem] leading-6 lg:text-lg">hours</div>
                        </div>
                    ) : null}
                    {time > 59 ? (
                        <div className="flex flex-col items-center justify-center w-28">
                            <div className="text-[3vh]">{pad(Math.floor(((time ?? 0) % 3600) / 60))}</div>
                            <div className="text-[1rem] leading-6 lg:text-lg">minutes</div>
                        </div>
                    ) : null}
                    <div className="flex flex-col items-center justify-center w-28">
                        <div className="text-[3vh]">{pad(Math.floor((time ?? 0) % 60))}</div>
                        <div className="text-[1rem] leading-6 lg:text-lg">seconds</div>
                    </div>
                </div>
            ) : null}
        </>
    )
}

export default Timer
