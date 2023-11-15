import React, { useEffect } from "react";

const Example = () => {
  return (
    <div className="grid place-content-center">
      <BubbleText />
    </div>
  );
};

const BubbleText = () => {
  useEffect(() => {
    const spans = document.querySelectorAll(
      ".hover-text span"
    ) as NodeListOf<HTMLSpanElement>;

    spans.forEach((span) => {
      span.addEventListener("mouseenter", function (this: typeof span) {
        this.style.fontWeight = "900";
        this.style.color = "#211b65";

        const leftNeighbor = this.previousElementSibling as HTMLSpanElement;
        const rightNeighbor = this.nextElementSibling as HTMLSpanElement;

        if (leftNeighbor) {
          leftNeighbor.style.fontWeight = "700";
          leftNeighbor.style.color = "#352ba1";
        }
        if (rightNeighbor) {
          rightNeighbor.style.fontWeight = "700";
          rightNeighbor.style.color = "#352ba1";
        }
      });

      span.addEventListener("mouseleave", function (this: typeof span) {
        this.style.fontWeight = "500";
        this.style.color = "#4338CA";

        const leftNeighbor = this.previousElementSibling as HTMLSpanElement;
        const rightNeighbor = this.nextElementSibling as HTMLSpanElement;

        if (leftNeighbor) {
          leftNeighbor.style.fontWeight = "500";
          leftNeighbor.style.color = "#4338CA";
        }

        if (rightNeighbor) {
          rightNeighbor.style.fontWeight = "500";
          rightNeighbor.style.color = "#4338CA";
        }
      });
    });
  }, []);

  return (
    <h2 className="hover-text text-center text-[7rem] font-medium text-primary mt-12">
      <Text>BytePit</Text>
    </h2>
  );
};

const Text = ({ children }: { children: string }) => {
  return (
    <>
      {children.split("").map((child, idx) => (
        <span
          style={{
            transition: "0.3s font-weight, 0.3s color",
          }}
          key={idx}
        >
          {child}
        </span>
      ))}
    </>
  );
};

export default Example;