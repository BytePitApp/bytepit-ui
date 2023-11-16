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
            <div className="h-screen w-full flex grow flex-col justify-center items-center bg-form bg-cover">
                {loading ? (
                    <ProgressSpinner strokeWidth="8" className="w-72 h-72" />
                ) : (
                    <div className="bg-graymedium py-24 px-36 rounded-3xl">
                        <h2 className="flex text-4xl text-center font-semibold gap-2 text-primary flex-col justify-center items-center">
                            <span className="">Email confirmed!</span>
                            <span className="">Reirecting in:</span>
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
