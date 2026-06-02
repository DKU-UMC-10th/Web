
interface ITextInput {
    onChange: (text: string) => void;
}

const TextInput = ({onChange}:ITextInput) => {
    console.log('TextInput rendered');

    return (
        <input
            type='text'
            className="text-input"
            onChange={(e) => onChange(e.target.value)}
        />
    );
};

export default TextInput;