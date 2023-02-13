import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    type: null,
    continent: null,
    priceRange: null,
    allProperties: [],
    filteredProperties: [],
}

export const propertySlice = createSlice({
    name: 'property',
    initialState,
    reducers: {
        setProperties(state, action){
            state.allProperties = action.payload.allProperties
        },
    },
})

export const { setProperties } = propertySlice.actions

export default propertySlice.reducer