import React from 'react';
import { useLoaderData } from 'react-router-dom';
import styled from 'styled-components';

import App from '../App';
import { decrypt } from '../utilities/utils';

const StyledResults = styled.p`
    padding: 10px;
    font-size: 26px;
`;

interface DecrypterParams {
    decryptionText?: string;
}

export function loader({
    params
}: {
    params: DecrypterParams;
}): DecrypterParams {
    const decryptionText = params.decryptionText;
    return { decryptionText };
}

export const Decrypter = (): React.ReactElement => {
    const data = useLoaderData() as DecrypterParams;

    return (
        <App>
            <StyledResults>
                You have:{' '}
                {decrypt(
                    data.decryptionText ?? 'Error, try again or contact Walt'
                )}
            </StyledResults>
        </App>
    );
};
