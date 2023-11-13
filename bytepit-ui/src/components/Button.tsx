import { ButtonComponentSpecification } from "../Models/Button";

const Button = ({ label, styleClass, onClick }: ButtonComponentSpecification) => {
  return (
    <div className={styleClass} onClick={onClick}>
      {label}
    </div>
  );
};

export default Button;
