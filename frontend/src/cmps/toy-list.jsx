
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Link } from "react-router-dom"
import { ToyPreview } from "./toy-preview.jsx"
import { useState } from 'react';
import { useEffect } from 'react';
import { userService } from '../services/user.service.js';

export function ToyList({ toys, onRemoveToy, progressPrecent }) {
    const [isAdmin, setIsAdmin] = useState(false)
    const [draggableToys, updateDraggableToys] = useState(toys)

    useEffect(() => {
        setIsAdmin(checkIsAdmin())
    }, [])

    if (!toys) return ''
    function checkIsAdmin() {
        let loggedUser = userService.getLoggedinUser()
        if(!loggedUser) return
        if (loggedUser.isAdmin) return true
        return false
    }

    function handleOnDraggEnd(result) {
        if (!result.destination) return
        const items = Array.from(draggableToys);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        updateDraggableToys(items);
    }

    return (

        <DragDropContext onDragEnd={handleOnDraggEnd}>
            <Droppable droppableId="toys">
                {(provided) => (
                    <ul className="toy-list" {...provided.droppableProps} ref={provided.innerRef}>
                        {toys.map((toy, index) => {
                            return (
                                <Draggable key={toy._id} draggableId={toy._id} index={index}>
                                    {(provided) => (
                                        <li className="toy-card" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} >
                                            <Link className="btn" to={`/toy/details/${toy._id}`}><ToyPreview toy={toy} progressPrecent={progressPrecent} /></Link>
                                            {isAdmin && <div className="options">
                                                <Link className="btn" to={`/toy/details/${toy._id}`}><i className="fa-solid fa-info"></i></Link>
                                                <Link className="btn" to={`/toy/edit/${toy._id}`}><i className="fa-solid fa-pen-to-square"></i></Link>
                                                <button className="btn" onClick={() => { onRemoveToy(toy._id) }}><i className="fa-solid fa-trash-can"></i></button>
                                            </div>}
                                        </li>
                                    )}
                                </Draggable >
                            )
                        }
                        )}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
    )
}