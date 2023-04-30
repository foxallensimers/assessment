import { IChangeInput } from "../App"

interface IProps {
    span?: number | string,
    name : string,
    type? : "text" | "number" | "date",
    onChange : ((props : IChangeInput) => void),
    value : string
}


const TextInput = ({span = 2, name, type = "text", onChange, value} : IProps) => {

    return (
        <div  className={`sm:col-span-${span}`}>
            <label htmlFor={name} className="block text-sm font-medium leading-6 capitalize text-gray-900">{name}</label>
            <div className="mt-1">
                <input onChange={(e) => onChange({name, value : e.target.value})} value={value} type={type}  id={name}  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
        </div>
    )
}

export default TextInput