

import { toyService } from "../services/toy.service.js"
import { showErrorMsg } from "../services/event-bus.service.js"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

export function ToyEdit() {

    const [toyToEdit, settoyToEdit] = useState(null)
    const navigate = useNavigate()
    const params = useParams()


    useEffect(() => {
        if (params.toyId) loadtoy()
    }, [])

    async function loadtoy() {
        try {
            const toys = await toyService.getById(params.toyId)
            settoyToEdit(toys)
        } catch (err) {
            console.log('Had issued in toy edit:', err);
            navigate('/toy')
            showErrorMsg('toy not found!')
        }
    }

    function handleChange({ target }) {

        const field = target.name
        console.log('field: ', field);
        const value = target.type === 'number' ? (+target.value || '') : target.value
        settoyToEdit(prevtoy => ({ ...prevtoy, [field]: value }))

    }

    async function onSavetoy(ev) {
        ev.preventDefault()
        try {
            await toyService.save(toyToEdit)
            navigate('/toy')
        } catch (err) {
            console.log(err);
        }
    }
    
    if (!toyToEdit) return <div>Loading...</div>
    return (
        <section className="toy-edit">
            <h2 className="edit-title">Edit toy</h2>

            <form onSubmit={onSavetoy} >
                <div>
                    <label htmlFor="name">Name: </label>
                    <input className="txts-input" onChange={handleChange} value={toyToEdit.name} type="text" name="name" id="name" />
                </div>
                <div>
                    <label htmlFor="price">Price: </label>
                    <input className="txts-input" onChange={handleChange} value={toyToEdit.price} type="number" name="price" id="price" />
                </div>

                <div className="btns-section">

                    <button className="btn">Save</button>
                    <Link className="btn" to="/toy">Back to List</Link>
                </div>

            </form>

        </section>
    )

}