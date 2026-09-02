import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { IssueDetail } from './routes/IssueDetail'
import { IssuesList } from './routes/IssuesList'
import { Network } from './routes/Network'
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
          <Route path="issues" element={<IssuesList />} />
          <Route path="issues/:issueId" element={<IssueDetail />} />
          <Route path="network" element={<Network />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
