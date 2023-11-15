import { useEffect } from "react";

const BubbleText = () => {
    useEffect(() => {
        const spans = document.querySelectorAll(
            ".hover-text span"
        ) as NodeListOf<HTMLSpanElement>

        spans.forEach((span) => {
            span.addEventListener("mouseenter", function (this: typeof span) {
                this.style.fontWeight = "900"
                this.style.color = "#211b65"

                const leftNeighbor = this.previousElementSibling as HTMLSpanElement
                const rightNeighbor = this.nextElementSibling as HTMLSpanElement

                if (leftNeighbor) {
                    leftNeighbor.style.fontWeight = "700"
                    leftNeighbor.style.color = "#352ba1"
                }
                if (rightNeighbor) {
                    rightNeighbor.style.fontWeight = "700"
                    rightNeighbor.style.color = "#352ba1"
                }
            })

            span.addEventListener("mouseleave", function (this: typeof span) {
                if (this.textContent === "P" || this.textContent === "B") {
                    this.style.fontWeight = "800"
                    this.style.color = "#211b65"
                } else {
                    this.style.fontWeight = "500"
                    this.style.color = "#4338CA"
                }

                const leftNeighbor = this.previousElementSibling as HTMLSpanElement
                const rightNeighbor = this.nextElementSibling as HTMLSpanElement

                if (leftNeighbor) {
                    if (leftNeighbor.textContent === "P" || leftNeighbor.textContent === "B") {
                        leftNeighbor.style.fontWeight = "800"
                        leftNeighbor.style.color = "#211b65"
                    } else {
                        leftNeighbor.style.fontWeight = "500"
                        leftNeighbor.style.color = "#4338CA"
                    }
                }

                if (rightNeighbor) {
                    if (rightNeighbor.textContent === "P" || rightNeighbor.textContent === "B") {
                        rightNeighbor.style.fontWeight = "800"
                        rightNeighbor.style.color = "#211b65"
                    } else {
                        rightNeighbor.style.fontWeight = "500"
                        rightNeighbor.style.color = "#4338CA"
                    }
                }
            })
        })
    }, [])

    return (
        <div className="grid place-content-center">
            <h2 className="hover-text text-center mt-12">
                <Text>BYTE PIT</Text>
            </h2>
        </div>
    )
}

const Text = ({ children }: { children: string }) => {
    return (
        <>
            {children.split("").map((child, idx) => {
                if (child === "P" || child === "B") {
                    return (
                        <span className="drop-shadow-xl text-[7rem] font-extrabold text-[#211b65]" style={{ transition: "0.3s font-weight, 0.3s color" }} key={idx}>
                            {child}
                        </span>
                    )
                } else {
                    return (
                        <span className="drop-shadow-xl text-[6rem] font-medium text-primary" style={{ transition: "0.3s font-weight, 0.3s color" }} key={idx}>
                            {child}
                        </span>
                    )
                }
            })}
        </>
    )
}

export default BubbleText