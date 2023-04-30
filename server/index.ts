import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import 'express-async-errors'
import morgan from 'morgan'
import helmet from 'helmet'
import axios from 'axios'

const PORT = process.env.PORT || 4000
const app = express()
app.use(morgan("dev"))
app.use(helmet())

interface IResult {
    time: {
        interval_start: string,
        max: string,
        min: string
    },
    value: {
        average: number,
        count: number,
        max: number,
        min: number,
        'standard deviation': number
    }
}


app.get("/api/stats", async (req, res) => {
    const baseURL = "https://api.v2.emissions-api.org/api/v2/methane/statistics.json"
    const query: any = { limit: 10, ...req.query }
    const queryFilter = Object.keys(query).map((item) => Array.isArray(query[item]) ? `${item}=${query[item].join(`&${item}=`)}` : `${item}=${query[item]}`).join("&")

    const requestURL = `${baseURL}?${queryFilter}`
    console.log("sending request to ", queryFilter)
    try {
        const response = await axios.get(requestURL)
        const data: IResult[] = response.data

        const modifiedData = data.map((item) => {
            return {
                interval_start: new Date(item.time.interval_start).toISOString().split("T")[0],
                time_max: new Date(item.time.max).toISOString().split("T")[0],
                time_min: new Date(item.time.min).toISOString().split("T")[0],
                value_average: item.value.average,
                value_count: item.value.count,
                value_max: item.value.max,
                value_min: item.value.min,
                standard_deviation: item.value['standard deviation']
            }
        })


        res.json(modifiedData)
    } catch (err: any) {
        res.status(400).json({ message: err?.response?.data || "Something went wrong!" })

    }

})

app.get("/favicon.ico", (req, res) => {
    res.status(200).end()
})


app.all("*", ((req, res) => {
    res.status(404).send("Requested route is not valid : " + req.url)
}))


const server = app.listen(PORT, (() => {
    console.log("server is running on " + PORT)
}))

process.on("unhandledRejection", (err: Error) => {
    console.log("unhandledRejection Error... System will terminate soon")
    console.log(err.name, err.message, err.stack)


    server.close(() => {

        process.exit(1)
    })

})