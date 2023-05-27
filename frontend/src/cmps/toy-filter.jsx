
import { useDispatch, useSelector } from "react-redux";
import { utilService } from "../services/util.service.js";
import { FILTER_BY, SORT_BY } from "../store/toy.reducer.js";
import { useEffect, useRef, useState } from "react";
import { toyService } from "../services/toy.service.js";


export function ToyFilter({ onSearch, onSetFilter, onAddToy }) {
  const dispatch = useDispatch()
  const filterBy = useSelector((storeState) => storeState.toyModule.filterBy)
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false)
  // const sortBy = useSelector((storeState) => storeState.toyModule.sortBy)
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
  const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle',
    'Outdoor', 'Battery Powered']
  const onSearchDebounce = useRef(utilService.debounce(onSearch))

  useEffect(() => {
    onLabelChange(selectedLabels)
  }, [selectedLabels])

  useEffect(() => {
    onSearchDebounce.current(filterBy)
    dispatch({ type: FILTER_BY, filterByToEdit })
  }, [filterByToEdit])
  function toggleDropdown() {
    setDropdownVisible((prevState) => !prevState)
  }

  function handleLabelChange(event) {
    const label = event.target.value
    if (event.target.checked) {
      setSelectedLabels([...selectedLabels, label])
    } else {
      setSelectedLabels(selectedLabels.filter(l => l !== label))
    }
  }

  function onLabelChange(selectedLabels) {
    setFilterByToEdit((prevFilter) => ({
      ...prevFilter,
      labels: selectedLabels,
    }))
  }


  function onHandleSearch(ev) {
    const val = ev.target.value
    onSearch(val)
  }

  function onInStock({ target }) {
    let isInStock = target.checked
    if (isInStock) onSetFilter({ inStock: true })
    else onSetFilter({ inStock: false })
  }

  function onSortBy(ev) {
    const value = ev.target.value
    console.log(value)
    dispatch({ type: SORT_BY, sortBy: value })
  }

  return (
    <section className="toy-filter full">
      <p>Filters:</p>

      <select onChange={onSortBy} className="txt-input" name="sort" id="sort">
        <option value="title">Name</option>
        <option value="price">Price</option>
        <option value="createdAt">Created At</option>
      </select>

      <div className="dropdown-wrapper">
        <div className={`dropdown ${dropdownVisible ? 'open' : ''}`}>
          <div className="dropdown-toggle" onClick={toggleDropdown}>
            Categories
          </div>
          <div className="dropdown-options">
            {labels.map((label) => (
              <div key={label}>
                <input
                  type="checkbox"
                  id={label}
                  value={label}
                  checked={selectedLabels.includes(label)}
                  onChange={handleLabelChange}
                />
                <label htmlFor={label}>{label}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lables">
        <div>
          <input type="checkbox" onChange={onInStock} id="inStock" />
          <label htmlFor="inStock">In stock</label>
        </div>
      </div>
      <input type="search" className="txt-input" placeholder="search" onChange={onHandleSearch} />
      <button className="btn" onClick={onAddToy}>
        Add Toy
      </button>
    </section>
  );
}
