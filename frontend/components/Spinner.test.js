import Spinner from './Spinner'
import React from 'react'
import {render, screen} from "@testing-library/react"

// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
test('sanity', () => {
  expect(true).toBe(true)
})

test('the spinner renders when on', () => {
  render(<Spinner on={true} />)
  const spinnerActive = screen.queryByText(/please wait/i);
  expect(spinnerActive).not.toBeNull()
})

test('the spinner renders when off', () => {
  render(<Spinner on={false}/>)
  const spinnerActive = screen.queryByText(/please wait/i)
  expect(spinnerActive).toBeNull()
})
