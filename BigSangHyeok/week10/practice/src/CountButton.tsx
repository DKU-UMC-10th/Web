import {memo} from 'react';


interface ICountButton {
    onClick: (count: number) => void;
}

const CountButton = ({onClick}: ICountButton) => {
    console.log('CountButton rendered');

    return (
        <button className="count-button" onClick={() => onClick(10)}>
            카운트 증가
        </button>
    );
};

export default memo(CountButton);
