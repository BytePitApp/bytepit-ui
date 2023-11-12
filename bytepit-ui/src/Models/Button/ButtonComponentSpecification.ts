export interface ButtonComponentSpecification {
    label: string;
    updateValue: () => void;
    onClick: () => void;
    styleClass: string;
}