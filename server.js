const express = require("express")

const fs = require("fs")

const app = express()

const PORT = 3000

function loadDB(req, res, next) {

    try {
        const data = JSON.parse(fs.readFileSync("./db.json", "utf-8"))

        req.db = data

        next()

    } catch (err) {

        console.error(err)

    }

}

app.use(express.json())

app.use(loadDB)


app.get("/api/student", (req, res) => {
    res.json(req.db)
})

app.get("/api/student/:id", (req, res) => {
    
    const studentData = req.db

    const rollNo = req.params.id

    if (!studentData[rollNo]) {

        res.status(404)

        res.json({
            "message": "Student Not Found",
            "data": null
        })

        return
    }

    res.json({
        "message": "Student Found",
        "data": studentData[rollNo]
    })

})

app.post("/api/student", (req, res) => {

    const studentData = req.db


    const { name, rollNo, address, age, branch, year, sem } = req.body

    if ( !name || !rollNo || !address || !age || !branch || !year || !sem) {
        res.status(400).json({
            "message": "Fields are Required",
            "data": null
        })

        return
    }

    if (studentData[rollNo]) {
        res.json({
            "message": "Student Already Exist",
            "data": null
        })

        return
    }

    studentData[rollNo] = { name, address, age, branch, year, sem }

    res.status(201).json({
        "message": "Student Added Successfully",
        "data": { name, rollNo, address, age, branch }
    })

    fs.writeFileSync("./db.json", JSON.stringify(studentData, null, 2))

})

app.put("/api/student/:id", (req, res) => {

    const studentData = req.db

    const rollNo = req.params.id

    const data = req.body

    if ( !data ) {
        res.status(400).json({
            "message": "Fields are Required",
            "data": null
        })

        return
    }

    if (!studentData[rollNo]) {
        res.json({
            "message": "Student does not Exist",
            "data": null
        })

        return
    }

    studentData[rollNo] = { ...studentData[rollNo],  ...data}

    res.status(201).json({
        "message": "Student Updated Successfully",
        "data": studentData[rollNo]
    })

    fs.writeFileSync("./db.json", JSON.stringify(studentData, null, 2))

})

app.delete("/api/student/:id", (req, res) => {

    const studentData = req.db

    const rollNo = req.params.id

    if (!studentData[rollNo]) {
        res.json({
            "message": "Student does not Exist",
            "data": null
        })

        return
    }

    const copy = {...studentData[rollNo]}


    delete studentData[rollNo]

    res.status(201).json({
        "message": "Student Deleted Successfully",
        "data": copy
    })

    fs.writeFileSync("./db.json", JSON.stringify(studentData, null, 2))

})


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})