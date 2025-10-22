import React, { useEffect } from 'react'

const Filters = ({
    sortBy,
    setSortBy, 
    showAC, 
    setShowAC, 
    showNonAC, 
    setShowNonAC, 
    selectedOperators,
    handleOperatorChange,
    clearFilters,
    isFilterActive,
    operators
}) => {

    return (
        <>
            <div className="filter-heading">
                <h2>Filter Buses</h2>
                <button onClick={clearFilters} className="clear-filter-btn" disabled={!isFilterActive}>
                    Clear Filters
                </button>
            </div>
            <div className="filter-options">
                <h4>Price</h4>
                <label>
                    <input
                        type="radio"
                        name="sort"
                        value="lowToHigh"
                        checked={sortBy === "lowToHigh"}
                        onChange={() => setSortBy("lowToHigh")}
                    />
                    Low to High
                </label>
                <label>
                    <input
                        type="radio"
                        name="sort"
                        value="highToLow"
                        checked={sortBy === "highToLow"}
                        onChange={() => setSortBy("highToLow")}
                    />
                    High to Low
                </label>
            </div>
            <div className="filter-options">
                <h4>Bus type</h4>
                <label>
                    <input
                        type="checkbox"
                        checked={showAC}
                        onChange={() => setShowAC(!showAC)}
                    />
                    AC
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={showNonAC}
                        onChange={() => setShowNonAC(!showNonAC)}
                    />
                    Non-AC
                </label>
            </div>
            <div className="filter-options">
                <h4>Bus Operator</h4>
                {operators.map(op => (
                    <label key={op}>
                        <input
                            type="checkbox"
                            checked={selectedOperators.includes(op)}
                            onChange={() => handleOperatorChange(op)}
                        />
                        {op}
                    </label>
                ))}
            </div>
</>
    
    )
}

export default Filters