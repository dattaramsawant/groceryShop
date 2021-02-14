import React from 'react'

export default function Pagination(props) {
    return (
        <div className="tablePagination">
            <p className="rowsPerPage">Rows per page</p>
            <select
                onChange={props.handleChange}
                name="limit"
                value={props.limit}
                className="limitDropdown"
            >
                <option value='10'>10</option>
                <option value='25'>25</option>
                <option value='50'>50</option>
            </select>
            <div className="arrowMain">
                <i onClick={props.page!==0 ? props.prev:undefined} className={`fa fa-angle-left leftArrow ${props.page===0 && 'disableArrow'}`}></i>
                <i onClick={(((props.count - (props.currentCount * (props.page + 1)))===0)|| (props.currentCount<props.limit)) ? undefined:props.next} className={`fa fa-angle-right rightArrow ${(((props.count - (props.currentCount * (props.page + 1)))===0)|| (props.currentCount<props.limit)) && 'disableArrow'}`}></i>
            </div>
        </div>
    )
}
