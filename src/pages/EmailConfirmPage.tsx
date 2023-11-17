import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import "./nabla.css"
import { ProgressSpinner } from "primereact/progressspinner"
import { confirmEmail } from "../services/login.service"
import { Navbar } from "../components"

const EmailConfirmPage = () => {
    const { id } = useParams()
    const [countdown, setCountdown] = useState(5)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!loading) {
            const interval = setInterval(() => {
                setCountdown((prev) => prev - 1)
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [loading])

    useEffect(() => {
        if (countdown <= 0) {
            setTimeout(() => {
                window.location.href = "/login"
            }, 500)
        }
    }, [countdown])

    const sendEmailConfirmation = async () => {
        try {
            if (id) {
                await confirmEmail(id)
                setLoading(false)
            }
        } catch (err: any) {
            console.log(err)
        }
    }

    useEffect(() => {
        sendEmailConfirmation()
    }, [])

    return (
        <div className="flex flex-col h-screen justify-center">
            <Navbar />
            <div className=" w-full flex grow flex-col justify-center items-center bg-form bg-cover">
                {loading ? (
                    <div className="z-50 absolute top-1.5 left-[50%]">
                        <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
                    </div>
                ) : (
                    <div className="bg-graymedium py-8 2xl:py-16 px-16 2xl:px-24 rounded-xl 2xl:rounded-3xl border-graydark border-b-4 drop-shadow-xl">
                        <h2 className="flex text-3xl 2xl:text-4xl text-center font-semibold gap-2 2xl:gap-3 text-primary flex-col justify-center items-center">
                            <span className="">Email confirmed!</span>
                            <span className="text-2xl 2xl:text-3xl">Redirecting in:</span>
                        </h2>
                        <h1 className="flex justify-center items-center">
                            <span>{countdown}</span>
                        </h1>
                    </div>
                )}
            </div>
        </div>
    )
}

export default EmailConfirmPage
