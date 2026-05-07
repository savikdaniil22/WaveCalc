import { ParameterForm } from './components/ParameterForm'
import { ResultsDashboard } from './components/ResultsDashboard'

function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid w-full max-w-7xl gap-4 p-4 md:grid-cols-12 md:p-6">
        <header className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 md:col-span-12">
          <h1 className="text-2xl font-semibold md:text-3xl">
            Информационная система расчета параметров радиолинии
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Онлайн-расчёт параметров радиолинии с визуализацией зоны Френеля и оценкой качества связи.
          </p>
        </header>
        <section className="md:col-span-4">
          <ParameterForm />
        </section>
        <section className="md:col-span-8">
          <ResultsDashboard />
        </section>
      </div>
    </main>
  )
}

export default App
