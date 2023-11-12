import { ButtonComponentSpecification } from "../Models/Button/ButtonComponentSpecification";

const Button = ({ label, styleClass, onClick }: ButtonComponentSpecification) => {
    const handleClick = () => {
        if (onClick) {
          onClick();
        }
    }
  return (
    <button className={styleClass} onClick={handleClick}>
      {label}
    </button>
  );
};

export default Button;
