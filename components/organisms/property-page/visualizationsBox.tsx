import { useEffect, useState } from "react";
import GraphicIcon from "../../atoms/icons/graphicIcon";


export interface IVisualizationsBox {
  views: number
}

const VisualizationsBox = ({ views }: IVisualizationsBox) => {

  const [visualizationsMetric, setVisualizationMetrics] = useState('')

  const visualizations = views;

  const viewsStatus = visualizationsMetric === 'low' ? 'Pouco visualizado' : visualizationsMetric === 'medium' ? 'Média visualizações' : visualizationsMetric === 'high' ? 'Muito visualizado' : ''

  useEffect(() => {
    if (visualizations < 50) setVisualizationMetrics('low');
    if (visualizations > 50 && visualizations < 100) setVisualizationMetrics('medium');
    if (visualizations > 100) setVisualizationMetrics('high');
  }, [visualizations])

  return (
    <section
      className={`border flex-row border-green-500 rounded-[15px] px-5 py-1 flex gap-2 text-quaternary bg-tertiary items-center mt-5 ${visualizationsMetric === 'low' ? 'border-green-500' :
        visualizationsMetric === 'medium' ? 'border-secondary' :
          'border-primary'
        }`}
    >
      <GraphicIcon fill={visualizationsMetric === 'low' ? "green" : visualizationsMetric === 'medium' ? "#F5BF5D" : "#F75D5F"} width="2.4rem" height="2.4rem" />
      <div className="flex flex-col md:flex-row w-full items-center">
        <h3 className="text-xl font-bold">{viewsStatus}</h3>
        <p className="text-lg font-normal">{visualizations === 1 ? 'Já houve 1 acesso' : `Já foram ${visualizations} acessos.`}</p>
      </div>
    </section>
  )
}

export default VisualizationsBox