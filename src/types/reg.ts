export type RegRequest = {
    type: 'reg',
    data:
        {
            name: string,
            password: string,
        },
    id: 0,
}

export type RegResponse = {
    type: 'reg',
    data:
        {
            name: string,
            index: number | string,
            error: boolean,
            errorText: string,
        },
    id: 0,
}