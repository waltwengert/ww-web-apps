import styled from 'styled-components';
import { MOBILE_DEVICE_WIDTH } from '@ww-web-apps/ui';

const ResultsContainer = styled.div`
    flex: 1 1 auto;

    background-color: #165b33;
    overflow: auto;

    margin: 20px auto 40px;

    width: 50vw;

    @media (max-width: ${MOBILE_DEVICE_WIDTH}px) {
        width: 90vw;
    }
`;

const NamesContainer = styled.div`
    width: 50%;
    display: inline-block;
`;

const Name = styled.div`
    padding: 20px 10px;
    color: white;
`;

const ResultText = styled.div`
    color: #f8b229;
`;

const ResultLink = styled.a`
    color: #f8b229;
`;

interface ResultsProps {
    nameList: string[];
    shuffledNameList: string[];
    hidden: boolean;
    encrypted: boolean;
}

export const Results = ({
    nameList,
    shuffledNameList,
    hidden,
    encrypted
}: ResultsProps) => {
    const names = nameList.map(name => (
        <Name key={`name-${name}`}>{name}</Name>
    ));
    const shuffledNames = shuffledNameList.map(name => (
        <Name key={`shuffledName-${name}`} hidden={hidden}>
            {encrypted ? (
                <ResultLink href={`/secret-santa/#/decrypter/${name}`}>
                    {name}
                </ResultLink>
            ) : (
                <ResultText>{name}</ResultText>
            )}
        </Name>
    ));

    return (
        <ResultsContainer>
            <NamesContainer>{names}</NamesContainer>
            <NamesContainer>{shuffledNames}</NamesContainer>
        </ResultsContainer>
    );
};
