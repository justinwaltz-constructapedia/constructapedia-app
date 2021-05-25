import React, {useState, useEffect} from 'react';

function Clock(props){
    const [date, setDate] = useState(new Date());

    useEffect(()=>{
        let timerID;
        timerID = setInterval(
            setDate(new Date()),
            1000
        );
        return ()=> {
            clearInterval(timerID);
        }
    },[]);

    return(
        <li className="clock">
            <p>{date.toLocaleTimeString()}</p>
        </li>
    )
}
/*
class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date()}
    }

    componentDidMount(){
        this.timerID = setInterval(
            ()=> this.tick(),
            1000
        );
    }
    componentWillUnmount(){
        clearInterval(this.timerID);
    }
    tick () {
        this.setState({
            date: new Date()
        });
    }
    render () {
        return (
            <li className="clock">
                <p>{this.state.date.toLocaleTimeString()}</p>
            </li>
        )
    }
}
*/
export default Clock
