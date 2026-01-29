

interface Props {
    title: string;
}

const GeneralTitle = ({title} : Props) => {
    return(
        <div>
          <span className="text-gray6 font-bold text-2xl leading-relaxed tracking-wide">{title}</span>
        </div>
    );
};

export default GeneralTitle;