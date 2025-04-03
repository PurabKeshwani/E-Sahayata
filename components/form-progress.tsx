import { CheckCircle2 } from "lucide-react"

interface FormProgressProps {
  currentStep: number
  totalSteps: number
}

export function FormProgress({ currentStep, totalSteps }: FormProgressProps) {
  return (
    <div className="relative mb-8">
      <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted"></div>
      <div
        className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-primary transition-all duration-300"
        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
      ></div>
      <div className="relative flex justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCurrent
                      ? "border-primary bg-background text-primary"
                      : "border-muted bg-background text-muted-foreground"
                }`}
              >
                {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : stepNumber}
              </div>
              <span className={`mt-2 text-xs ${isCompleted || isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                Step {stepNumber}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

