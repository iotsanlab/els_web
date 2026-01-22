'use client'

type SwitchUIProps = {
  isChecked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export default function SwitchUI({ isChecked, onChange, disabled = false }: SwitchUIProps) {
  return (
    <label className={`relative inline-flex cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isChecked}
        disabled={disabled}
        onChange={() => !disabled && onChange(!isChecked)}
      />
      <div
        className={`relative w-11 h-6 bg-gray6 peer-checked:bg-[#5EB044] rounded-[10px] 
        transition-all duration-300 ease-in-out ${disabled ? 'cursor-not-allowed' : ''}`}
      >
        <span
          className={`absolute top-1/2 -translate-y-1/2 left-[3px] bg-white rounded-[10px]
          shadow-md w-4 h-4 transition-all duration-300 ease-in-out
          ${isChecked ? 'translate-x-5' : 'translate-x-0'}`}
        ></span>
      </div>
    </label>
  )
}