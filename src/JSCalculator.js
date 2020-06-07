import React from 'react';
import './JSCalculator.scss';

const NUMBERS = [
    {id:"clear",value:'C',},
    {id:"divide",value:"/",},
    {id:"multiply",value:"*",},
    {id:"seven",value:'7',},
    {id:"eight",value:'8',},
    {id:"nine",value:'9',},
    {id:"subtract",value:'-',},
    {id:"four",value:'4',},
    {id:"five",value:'5',},
    {id:"six",value:'6',},
    {id:"add",value:'+',},
    {id:"one",value:'1',},
    {id:"two",value:'2',},
    {id:"three",value:'3',},
    {id:"decimal",value:'.',},
    {id:"zero",value:'0',}, 
    {id:"equals",value:'=',},
]
const NUMBER_REGEX = /\d/gm;    //regex to check if button is a number
class Button extends React.Component{

    handleClick = (event) => {
        //This let checks if button clicked is a number or not - if it's a number use handleNumber() else go to other functions
        let numberMatch = this.props.value.match(NUMBER_REGEX);     
        
        if(numberMatch!=null){
            this.props.handleNumber(this.props.value)
        }
        else if(this.props.value === 'C'){
            this.props.clearDisplay();
        }
        else if(this.props.value === '='){
            this.props.handleCalculation();
        }
        else if(this.props.value === '.'){
            this.props.handleDecimal(this.props.value);
        }
        else{
            this.props.handleOperator(this.props.value);
        }
    }

    render(){
        return(
            <button id={this.props.id} className="buttons" onClick={this.handleClick}>
                {this.props.value}
            </button>
        );
    }
}

class JSCalculator extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            calculated: false,
            currentDisplay: '0',
            memory:'',
            lastOperator:''
        }
        this.handleNumber = this.handleNumber.bind(this);
        this.clearDisplay = this.clearDisplay.bind(this);
        this.clearZero = this.clearZero.bind(this);
        this.handleOperator = this.handleOperator.bind(this);
        this.handleDecimal = this.handleDecimal.bind(this);
        this.handleCalculation = this.handleCalculation.bind(this);
    }

    handleNumber = (value) => {

        if(value === '0' && this.state.currentDisplay === '0'){
            return;
        }
        if(this.state.currentDisplay ==='0'){
            //clear initial zero value and update here
            this.clearZero(value);
            return;
        }

        this.setState({          
            currentDisplay:this.state.currentDisplay.concat(value),
            memory:this.state.memory.concat(value)
        });
       
    }
    /*handle operator concats operators to current display
      and makes memory return to empty string to handle decimals
    */
    handleOperator(operator){
        //check if calculation has been made - redo calculation from previous state (answer)
        if(this.state.calculated){
            this.setState({
                currentDisplay:this.state.currentDisplay.concat(operator),
                memory:'',
                lastOperator:operator
            });
            return
        }

        this.setState({
            currentDisplay:this.state.currentDisplay.concat(operator),
            memory:'',
            lastOperator:operator
        });
       
    }
    //this wholly relies on memory state to check if current numbers has a decimal value
    handleDecimal(decimal){
        if(this.state.memory.includes('.')||this.state.memory ===''){
            return
        }
        this.setState({
            currentDisplay: this.state.currentDisplay.concat(decimal),
            memory:this.state.memory.concat(decimal)
        })
    }
    // eval() function to handle calculations - if one or more operators regex replaces with state.lastOperator if last operator is minus ignore
    handleCalculation(){       
        if(this.state.lastOperator === '-'){
            this.setState({
                currentDisplay: eval(this.state.currentDisplay).toString(),
                calculated:true
            })
            return
        }
        const groupedNumbers = this.state.currentDisplay.replace(/(\D{2,})/gm,this.state.lastOperator);  
        this.setState({
            currentDisplay: eval(groupedNumbers).toString(),
            calculated:true
        })
    }
    //clear initial zero at startup and assign new value from handleNumber()
    clearZero(value){
        this.setState({
            currentDisplay:'',
            currentDisplay:value,
            memory:value
        });

    }
    clearDisplay(){
        this.setState({
            currentDisplay: '0'
        })
    }

    render(){
        return(
            <div id="calculator-container">
                <div id="calculator">
                    <div id="displayNumbers">
                        <p id='display'>{this.state.currentDisplay}</p>                       
                    </div>
                    {/*Buttons components iteration*/}
                    {NUMBERS.map(button => (
                        <Button
                            id={button.id}
                            value={button.value}
                            handleNumber={this.handleNumber}
                            clearDisplay={this.clearDisplay}
                            handleOperator={this.handleOperator}
                            handleDecimal={this.handleDecimal}
                            handleCalculation={this.handleCalculation}
                        />
                    ))}
                    <p id="author">By Terry Nguyen</p>
                </div>
               
            </div>
            
        );
    }
} 
export default JSCalculator;