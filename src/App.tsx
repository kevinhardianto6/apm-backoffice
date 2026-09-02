import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Overview } from './routes/Overview'
import { RootRedirect } from './routes/RootRedirect'
import { Shell } from './routes/Shell'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/apps/:appId" element={<Shell />}>
          <Route index element={<Overview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
