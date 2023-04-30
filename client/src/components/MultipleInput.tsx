
import { IChangeProps, IDeleteInput, IForm } from '../App'

interface IProps {
    formData: IForm,
    inputDeleteHandler: (props: IDeleteInput) => void,
    multipleInputValueChangeHnadler: (props: IChangeProps) => void,
    addItem: (name : "polygon" | "geoframe" | "point") => void,
    name: "polygon" | "geoframe" | "point"

}

const MultipleInput = ({ formData, inputDeleteHandler, multipleInputValueChangeHnadler, addItem, name }: IProps) => {
    

    return (
        <div className="sm:col-span-1">
            <label htmlFor={name} className="block capitalize text-sm font-medium leading-6 text-gray-900">{name}</label>
            <div className="mt-1">
                {formData[name].map((item, inx) => {
                    return (
                        <div key={inx} className={`sm:col-span-1`}>
                            <div className="mt-2 flex items-center gap-x-2 ">
                                <input type={"number"} value={item} onChange={(e) => multipleInputValueChangeHnadler({ name, index : inx, value: e.target.value })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                <button onClick={() => inputDeleteHandler({ name, index : inx })} type="button" className="rounded-md mt-2 bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">-</button>

                            </div>
                        </div>
                    )
                })}
                <button onClick={() => addItem(name)} type="button" className="rounded-md mt-2 capitalize bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">Add {name}</button>
            </div>
        </div>
    )
}

export default MultipleInput