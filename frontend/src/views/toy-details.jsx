

import { toyService } from '../services/toy.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { reviewService } from '../services/review.service.js'


export function ToyDetails() {

    const [msg, setMsg] = useState(toyService.getEmptyMsg())
    const [review, setReview] = useState(reviewService.getEmptyReview())
    const [toy, setToy] = useState(null)
    const { toyId } = useParams()

    useEffect(() => {
        toyService.getById(toyId)
            .then(toy => { setToy(toy) })
            .catch(err => {
                showErrorMsg('Cannot load toy')
            })
    }, [])

    function handleMsgChange(ev) {
        let val = ev.target.value
        setMsg((prevMsg) => ({ ...prevMsg, txt: val }))
        console.log(msg);
    }

    async function onSaveMsg(ev) {
        ev.preventDefault()
        try {
            const savedMsg = await toyService.addToyMsg(toyId, msg)
            setToy((prevToy) => ({ ...prevToy, msgs: [...prevToy.msgs, savedMsg] }))
            console.log(savedMsg);
            showSuccessMsg('Msg saved!')

        } catch (err) {
            console.log('err', err)
            showErrorMsg('Cannot save Msg')
        }
    }

    function handleReviewChange(ev) {
        let val = ev.target.value
        setReview((prevReview) => ({ ...prevReview, txt: val }))
        console.log(review);
    }

    async function onSaveReview(ev) {
        ev.preventDefault()
        try {
            const savedReview = await reviewService.save(toyId, review)
            setToy((prevToy) => ({ ...prevToy, reviews: [...prevToy.reviews, savedReview] }))
            console.log(savedReview);
            showSuccessMsg('Msg saved!')

        } catch (err) {
            console.log('err', err)
            showErrorMsg('Cannot save Msg')
        }
    }



    if (!toy) return <h1>loadings....</h1>
    return toy && <div className='main-layout'>
        <section className='details-container'>
            <div className='details'>
                <h3>Toy Details:</h3>
                <h5>Name: {toy.name}</h5>
                <h4>ID:{toy._id}</h4>
                <h4>Created At: {toy.createdAt}</h4>
                <h4>Labels: {toy.labels.join(', ')}</h4>
                <h4>In Stock: {toy.inStock ? 'Last one, hurry up!' : 'SOLD OUT'}</h4>
                {toy?.msgs?.length && <ul>
                    {toy.msgs.map((msg, index) =>

                        <li key={index} className="toy-Msgs clean-list">
                            {msg.by.fullname} : {msg.txt}
                        </li>

                    )}
                </ul>
                }
                {toy?.reviews?.length && <ul>
                    {toy.reviews.map((review, index) =>

                        <li key={index} className="toy-Msgs clean-list">
                            {review.user.fullname} : {review.txt}
                        </li>

                    )}
                </ul>
                }
                <form id="msg" onSubmit={onSaveMsg}>
                    <label htmlFor="">
                        <input onChange={handleMsgChange} className='txt-input' type="text" id="msg" />
                    </label>
                    <button className='btn'>Add Message</button>
                </form>
                <form id="review" onSubmit={onSaveReview}>
                    <label htmlFor="">
                        <input onChange={handleReviewChange} className='txt-input' type="text" id="review" />
                    </label>
                    <button className='btn'>Add review</button>
                </form>
                <Link className="btn" to="/toy">Back to List</Link>
            </div>
        </section>
    </div>

}

