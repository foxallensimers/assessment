import { IChangeInput } from "../App"


interface IProps {
    span?: number | string,
    name : string,
    options : {value : string, label : string}[],
    defaultValue? : string,
    onChange : ((props : IChangeInput) => void)

}

const SelectInput = ({span = 2, name, options, defaultValue, onChange} : IProps) => {

  return (
    <div className={`sm:col-span-${span}`}>
            <label htmlFor={name} className="block text-sm capitalize font-medium leading-6 text-gray-900">{name}</label>
            <div className="mt-1">
              <select onChange={(e) => onChange({name, value : e.target.value}) } defaultValue={defaultValue || options[0].value} id={name}  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                {options.map((item, inx) => {
                  return (
                    <option key={inx} value={item.value} >{item.label}</option>
                  )
                })}
              </select>
            </div>
          </div>
  )
}

export default SelectInput