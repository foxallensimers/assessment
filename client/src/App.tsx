
import { FormEvent, useEffect, useMemo, useState } from 'react'
import countryList from 'react-select-country-list'
import SelectInput from './components/SelectInput'
import TextInput from './components/TextInput'
import MultipleInput from './components/MultipleInput'
import { AiOutlineLoading } from 'react-icons/ai'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface IOptions {
  label: string,
  value: string
}

export interface IForm {
  product: string,
  geoframe: string[],
  country: string,
  polygon: string[],
  point: string[],
  interval: string,
  begin: string,
  end: string,
  limit: string,
  offset: string

}

interface MultiBaseProps {
  name: "geoframe" | "polygon" | "point", index: number
}

export interface IChangeProps extends MultiBaseProps {
  value: string
}


export interface IDeleteInput extends MultiBaseProps {

}

interface IResult {
  interval_start: string,
  time_max: string,
  time_min: string,
  value_average: number
  value_count: number,
  value_max: number,
  value_min: number
  standard_deviation: number
}

export interface IChangeInput {
  name: string,
  value: string
}


const initialState = {
  product: "methane",
  geoframe: [],
  country: "US",
  polygon: [],
  point: [],
  interval: "month",
  begin: "2021-01-01",
  end: "2022-01-01",
  limit: "10",
  offset: ""
}

function App() {
  const countryOptions: IOptions[] = useMemo(() => countryList().getData(), [])
  const gasOptions: IOptions[] = [{ label: "Methane", value: "methane" }, { label: "Carbonmonoxide", value: "carbonmonoxide" }, { label: "Ozone", value: "ozone" }, { label: "Nitrogendioxide", value: "nitrogendioxide" }]
  const intervalOptions: IOptions[] = [{ label: "Minute", value: "minute" }, { label: "Hour", value: "hour" }, { label: "Day", value: "day" }, { label: " Week", value: "week" }, { label: "Month", value: "month" }, { label: "Quarter", value: "quarter" }, { label: "Year", value: "year" }, { label: "Decade", value: "decade" }, { label: "Century", value: "century" }]
  const [formData, setFormData] = useState<IForm>(initialState)
  const [error, setError] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<IResult[]>([])


  const getData = async () => {
    // @ts-ignore
    const queryString = Object.keys(formData).map((item) => Array.isArray(formData[item as keyof IForm]) && formData[item as keyof IForm].length > 0 ? `${item}=${formData[item as keyof IForm].join(`&${item}=`)}` : formData[item as keyof IForm] != "" && `${item}=${formData[item as keyof IForm]}`).filter((item) => item != false).join("&")

    const response = await fetch(`api/stats?${queryString}`, { method: "GET" })
    const data = await response.json()
    setLoading(false)

    if (response.ok) {
      setResults(data)
      return
    }

    setError(data.message?.detail ?? data.message)
  }

  const formHandler = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // @ts-ignore
    await getData()

  }

  const addItem = (name: "polygon" | "geoframe" | "point") => {
    setFormData({ ...formData, [name]: [...formData[name], ""] })

  }

  const multipleInputValueChangeHnadler = (props: IChangeProps): void => {
    const currentData = formData[props.name]
    currentData[props.index] = props.value
    setFormData((prev) => { return { ...prev, [props.name]: currentData } })

  }

  const inputDeleteHandler = (props: IDeleteInput): void => {
    const currentData = formData[props.name].filter((_, inx) => inx != props.index)

    setFormData((prev) => { return { ...prev, [props.name]: currentData } })
  }

  const inputValueChangeHandler = ({ name, value }: IChangeInput): void => {
    setFormData((prev) => { return { ...prev, [name]: value } })

  }

  const resetValueHandler = () => {
    setFormData(initialState)
    setError("")
    setLoading(false)
  }

  useEffect(() => {
    ; (async () => {
      await getData()
    })()
  }, [])

  return (
    <div className='p-[40px]' >
      <h1 className='text-center p-4 text-xl font-bold' >Emissions API</h1>
      <form onSubmit={formHandler} >
        <div className=" grid grid-cols-1 px-11 gap-x-6 gap-y-2 sm:grid-cols-7">

          <SelectInput span={1} onChange={inputValueChangeHandler} name='product' defaultValue='methane' options={gasOptions} />
          <SelectInput span={1} onChange={inputValueChangeHandler} name='country' defaultValue='US' options={countryOptions} />
          <SelectInput span={1} onChange={inputValueChangeHandler} name='interval' defaultValue='month' options={intervalOptions} />
          <TextInput value={formData.begin} span={1} name='begin' type="date" onChange={inputValueChangeHandler} />
          <TextInput value={formData.end} span={1} name='end' type="date" onChange={inputValueChangeHandler} />
          <TextInput value={formData.limit} span={1} name='limit' type="number" onChange={inputValueChangeHandler} />
          <TextInput value={formData.offset} span={1} name='offset' type="number" onChange={inputValueChangeHandler} />

          <MultipleInput name='geoframe' addItem={addItem} formData={formData}
            inputDeleteHandler={inputDeleteHandler}
            multipleInputValueChangeHnadler={multipleInputValueChangeHnadler} />

          <MultipleInput name='polygon' addItem={addItem} formData={formData}
            inputDeleteHandler={inputDeleteHandler}
            multipleInputValueChangeHnadler={multipleInputValueChangeHnadler} />

          <MultipleInput name='point' addItem={addItem} formData={formData}
            inputDeleteHandler={inputDeleteHandler}
            multipleInputValueChangeHnadler={multipleInputValueChangeHnadler} />

        </div>
        {error &&
          <p className='p-6 text-center text-red-600 text-sm ' >{error}</p>}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button onClick={resetValueHandler} type="button" className="text-sm font-semibold leading-6 text-red-700">
            Reset
          </button>
          <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            {loading ? <AiOutlineLoading className=" animate-spin " /> : "Get Data"}
          </button>
        </div>
      </form>

      <div className="mt-4 h-[600px]" >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={results}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="interval_start" />

            <XAxis dataKey="value_max" />

            <YAxis />
            <Tooltip />
            <Legend />
            <Line name="Max Value" type="monotone" dataKey="value_max" stroke="#82ca9d" />
            <Line type="monotone" name="Average Value" dataKey="value_average" stroke="#8884d8" />
            <Line type="monotone" name="Min Value" dataKey="value_min" stroke="#368a9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default App
