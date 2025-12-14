import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import * as $ from "jquery";
import dayjs from "dayjs";
import moment from "moment";
import OutsideClickHandler from "../utils/OutsideClickHandler";


const DateTimeInput = (props) => {

    const D_FORMAT = "DD";
    const M_FORMAT = "MM";
    const Y_FORMAT = "YYYY";
    const H_FORMAT = "hh";
    const m_FORMAT = "mm";
    const S_FORMAT = "ss";

    const DEFAULT_FORMAT_STRUCTURE = [D_FORMAT,"-",M_FORMAT,"-",Y_FORMAT," ",H_FORMAT,":",m_FORMAT,":",S_FORMAT];
    const DEFAULT_FORMAT_VALUES = {
        [Y_FORMAT]:{ST:1500, EN: moment().year(), DE:'2000', FORMAT: "year"},
        [M_FORMAT]:{ST:1, EN:12, DE:'01', FORMAT: "month"},
        [D_FORMAT]:{ST:1, EN:31, DE:'01', FORMAT: "date"},
        [H_FORMAT]:{ST:0, EN:23, DE:'00', FORMAT: "time"},
        [m_FORMAT]:{ST:0, EN:59, DE:'00', FORMAT: "time"},
        [S_FORMAT]:{ST:0, EN:59, DE:'00', FORMAT: "time"}
    };
    const REGEX = /([\- :/,])/;


    const [format, setFormat] = useState("date");
    const [open, setOpen] = useState(false);
    const [gridCss, setGridCss] = useState("");
    const [formatStructure, setFormatStructure] = useState(DEFAULT_FORMAT_STRUCTURE);

    const [D, setD] = useState(D_FORMAT);
    const [M, setM] = useState(M_FORMAT);
    const [Y, setY] = useState(Y_FORMAT);
    const [H, setH] = useState(H_FORMAT);
    const [m, setm] = useState(m_FORMAT);
    const [S, setS] = useState(S_FORMAT);

    const getOutputValue = (formatStructure) => {
        const output = _.reduce(formatStructure, (value, structure) => {
            return value + getStructureValue(structure);
        }, "");
  
        // If all fields are empty (or default format symbols), return empty string
        const allEmpty = [D, M, Y, H, m, S].every(val =>
            val === "" || [D_FORMAT, M_FORMAT, Y_FORMAT, H_FORMAT, m_FORMAT, S_FORMAT].includes(val)
        );
        return allEmpty ? "" : output;
};

    const getDateValue = (formatStructure)=>{
        return _.reduce(formatStructure, (value, structure)=>{
            return value + getStructureValue(structure, true)
        }, "");
    }

    const setInputValue = (fstructure, value)=>{
        let inputValue = value.split(REGEX);
        _.map(fstructure, (structure, i)=>{
            setFormatText(structure, inputValue[i]);
        });
    }

    const getGridCss = (formatStructure)=>{
        return _.reduce(formatStructure, (chlist, split)=>{
            return [...chlist, split.length+'ch']
        }, []).join(" ");
    }


    const getStructureValue = (structure, defaultValue = false)=>{
        return (
            structure == Y_FORMAT ? (Y == Y_FORMAT || Y == "" ? (defaultValue ? DEFAULT_FORMAT_VALUES[Y_FORMAT].DE:""):Y):
            structure == M_FORMAT ? (M == M_FORMAT || M == "" ? (defaultValue ? DEFAULT_FORMAT_VALUES[M_FORMAT].DE:""):M):
            structure == D_FORMAT ? (D == D_FORMAT || D == "" ? (defaultValue ? DEFAULT_FORMAT_VALUES[D_FORMAT].DE:""):D):
            structure == H_FORMAT ? (H == H_FORMAT || H == "" ? (defaultValue ? DEFAULT_FORMAT_VALUES[H_FORMAT].DE:""):H):
            structure == m_FORMAT ? (m == m_FORMAT || m == "" ? (defaultValue ? DEFAULT_FORMAT_VALUES[m_FORMAT].DE:""):m):
            structure == S_FORMAT ? (S == S_FORMAT || S == "" ? (defaultValue ? DEFAULT_FORMAT_VALUES[S_FORMAT].DE:""):S):structure
        )
    }

    const setFormatText = async (format, value) =>{
        if(format == Y_FORMAT){await setY(value)};
        if(format == M_FORMAT){await setM(value)};
        if(format == D_FORMAT){await setD(value)};
        if(format == H_FORMAT){await setH(value)};
        if(format == m_FORMAT){await setm(value)};
        if(format == S_FORMAT){await setS(value)};
    }

    const onChange = async (date)=>{
        if(format == "year" || format == "month" || format == "date"){
            let formatTemp, valueTemp;
            if(format ==  "year"){ formatTemp = Y_FORMAT; valueTemp = (date.$y);}
            if(format == "month"){ formatTemp = M_FORMAT; valueTemp = ((date.$M+1) < 10 ? "0":"")+(date.$M+1);}
            if(format ==  "date"){ formatTemp = D_FORMAT; valueTemp = ((date.$D) < 10 ? "0":"")+(date.$D);}            
            await setFormatText(formatTemp, valueTemp);
            getNextByClass($(".smart-date-picker-text[format="+formatTemp+"]"), "smart-date-picker-text")?.trigger('markFocus');
        }
        else if(format == "time"){
            await setH((date.$H < 10 ? "0":"")+date.$H);
            await setm((date.$m < 10 ? "0":"")+date.$m);
            await setS((date.$s < 10 ? "0":"")+date.$s);
            await setOpen(false);
        }
    }

    useEffect(() => {
        props?.change(getOutputValue(formatStructure));
    }, [D,M,Y,H,m,S]);

    function getNextByClass(currentEl, className) {
        var allMatches = $('.' + className); // all elements with the target class
        var currentIndex = allMatches.index(currentEl);
        return currentIndex+1 < allMatches.length ? allMatches.eq(currentIndex + 1): undefined; // the next one after current
    }
    function getPreviousByClass(currentEl, className) {
        var allMatches = $('.' + className); // all elements with the target class
        var currentIndex = allMatches.index(currentEl);
        return currentIndex == 0 ? undefined : allMatches.eq(currentIndex - 1); // the next one after current
    }

    function checkValid(format, value){
        let val = Number(value);
        if(DEFAULT_FORMAT_VALUES[format].ST <= val && val <= DEFAULT_FORMAT_VALUES[format].EN){
            return true;
        }else{
            return false;
        }
    }

    const openInput = (e)=>{
        if($(e.target).hasClass("smart-date-picker-container")){
            let found = false;
            let elements = $(".smart-date-picker-text").get();
            $(elements).each(function(index, element) {
                if(element.innerHTML == "" && !found){
                    $(element).trigger('markFocus');
                    found = true;
                }
            });
            if(!found){
                $(elements[0]).trigger("markFocus");
            }
        }
    }

    const closeInput = (e)=>{
        if($(e.target).closest('.smart-date-picker-dropdown').length == 0){
            setOpen(false);
        }
    }

    const onOk = ()=>{
        setOpen(false);
        let elements = $(".smart-date-picker-text").get();
        $(elements).each(function(index, element) {
            $(element).blur();
        });
    }



    useEffect(()=>{
        let fstructure = (props.format ? props.format : DEFAULT_FORMAT_STRUCTURE.join("")).split(REGEX);
        setFormatStructure(fstructure);
        setGridCss(getGridCss(fstructure));
        if(props.formatValue){
            setInputValue(fstructure, props.formatValue);
        }

        // Keyup
        $(".smart-date-picker-text").off('keyup').on('keyup',(e)=>{
            let format = $(e.target).attr("format");
            if((e.keyCode > 47 && e.keyCode < 59)){
                let innerText = e.target.innerHTML;
                if(isNaN(innerText)){
                    e.preventDefault();
                    return;
                }else{
                    $(e.target).removeClass("danger");
                    if(innerText.length == format.length){
                        if(checkValid(format, innerText)){
                            setFormatText(format, innerText);
                            let nextElement = getNextByClass(e.target, "smart-date-picker-text");
                            if(nextElement){
                                nextElement?.trigger('markFocus')
                            }else{
                                $(e.target).blur();
                            }
                        }else{
                            $(e.target).addClass("danger");
                        }
                    }else if(innerText.length > format.length){
                        e.target.innerHTML = innerText.substring(0,format.length);
                    }
                }
            }else{
                e.preventDefault();
                return;
            }
        });

        // Keydown
        $(".smart-date-picker-text").off('keydown').on('keydown',(e)=>{
            let format = $(e.target).attr("format");
            if(e.key === 'Backspace' && e.keyCode === 8 && e.target.innerHTML.length == 0){
                setFormatText(format, "");
                e.preventDefault();
                getPreviousByClass(e.target, "smart-date-picker-text")?.trigger('markFocus');
                return;
            }else if(e.key === 'Enter' || e.keyCode === 13){
                e.preventDefault();
                getNextByClass(e.target, "smart-date-picker-text")?.trigger('markFocus');
                if(format == formatStructure[formatStructure.length-1]){
                    setTimeout(()=>{setOpen(false);},200);
                }    
                return;
            }
        });

        // Onblur
        $(".smart-date-picker-text").off('blur').on('blur',(e)=>{            
            let format = $(e.target).attr("format");
            let numberText = e.target.innerHTML;
            if(numberText.length != 0 && format.length != numberText.length){
                e.target.innerHTML = '0'.repeat((format.length - numberText.length)) + numberText;
                setFormatText(format, e.target.innerHTML);
            }
            if(format == formatStructure[formatStructure.length-1]){
                setTimeout(()=>{setOpen(false);},200);
            }
        });

        // Onclick|focus
        $(".smart-date-picker-text").on('focus click',(e)=>{
            let format = $(e.target).attr("format");
            setFormat(DEFAULT_FORMAT_VALUES[format].FORMAT);
            setOpen(true);
            setTimeout(()=>{
                $(".ant-picker-cell.ant-picker-cell-selected").off('click').on('click', (e)=>{
                    debugger
                })
            }, 200);    
        });

        //  OnmarkFocus
        $(".smart-date-picker-text").on('markFocus',(e)=>{
            let range = document.createRange();
            range.selectNodeContents(e.target);                
            range.collapse(false);
            
            let selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            e.target.focus();
        });
    },[]);

    return (
        <OutsideClickHandler onOutsideClick={closeInput}>
            {/* <span style={{position:'absolute', bottom:'-30px'}}>{getDateValue(formatStructure)}{formatStructure}</span> */}
            <div className="smart-date-picker">
                <div className="smart-date-picker-container" onClick={openInput}>
                    <DatePicker value={dayjs(getDateValue(formatStructure), formatStructure.join(""))} picker={format} popupClassName={"smart-date-picker-dropdown smart-"+format}  open={open} needConfirm={format == "time"} showNow={false} onChange={onChange} onOk={onOk}/>
                    <span className="smart-date-picker-placeholder">{formatStructure.join("")}</span>
                    <span className="smart-date-picker-text-container" style={{'grid-template-columns':gridCss}}>                        
                        {formatStructure.map((structure)=>{
                            if(structure.length == 1){
                                return (<span className="placeholder-color">{structure}</span>);
                            }else{
                                return(<span><span className="smart-date-picker-text" format={structure} type="text" role="textbox" contentEditable="true" suppressContentEditableWarning={true}>{getStructureValue(structure)}</span></span>);
                            }
                        })}
                    </span>
                </div>
            </div>
        </OutsideClickHandler>
    );
};

export default DateTimeInput;