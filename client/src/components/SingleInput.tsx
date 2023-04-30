import { IChangeProps, IDeleteInput, IForm } from "../App"

interface IProps {
    span?: number | string,
    data : IForm,
    setData : ((data : IForm) => void),
    index : number,
    name : "geoframe" | "polygon" | "point",
    onChange : ((data : IChangeProps) => void),
    onDelete : ((data : IDeleteInput) => void)
}


const SingleInput = ({span = 2, index, name, onChange, onDelete} : IProps) => {
  return (
    <div  className={`sm:col-span-${span} `}>
            <div className="mt-2 flex items-center gap-x-2 ">
                <input type={"number"}  onChange={(e) => onChange({name, index, value : e.target.value})}  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                <button onClick={() => onDelete({name, index})}  type="button" className="rounded-md mt-2 bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">-</button>

            </div>
        </div>
  )
}

export default SingleInput