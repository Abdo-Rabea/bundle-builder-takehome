type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
};

function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  disabled = false,
}: QuantityStepperProps) {
  return (
    <div className="quantity-stepper">
      <button
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
        type="button"
      >
        -
      </button>
      <span>{value}</span>
      <button
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        type="button"
      >
        +
      </button>
    </div>
  );
}

export default QuantityStepper;
