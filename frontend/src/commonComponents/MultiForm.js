import React from 'react'

export default function MultiForm(props) {
    return (
        <div className="multiFormMain">
            <div className="multiFormNameBoxMain">
                {props.formName.map(data=>(
                    <div className={props.formSelect && props.formSelect === data.id ? "multiFormNameBox activemMultiFormNameBox":"multiFormNameBox" } key={data.id} onClick={()=>props.selectForm(data.id)}>{data.name}</div>
                ))}
            </div>
            {props.formSelect &&
                <div className="multiFormBoxMain">
                    {props.children}
                </div>
            }
        </div>
    )
}
