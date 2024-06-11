import { useEffect, useState } from "react";
import GraphicIcon from "../../atoms/icons/graphicIcon";


export interface IVisualizationsBox {
  views: string[]
}

const VisualizationsBox = ({ views }: IVisualizationsBox) => {

  const [visualizationsMetric, setVisualizationMetrics] = useState('')

  const visualizations = views.length;

  useEffect(() => {
    if (visualizations < 50) setVisualizationMetrics('low');
    if (visualizations > 50 && visualizations < 100) setVisualizationMetrics('medium');
    if (visualizations > 100) setVisualizationMetrics('high');
  }, [visualizations])

  return (
    <section
      className={`border border-green-500 rounded-[15px] p-5 flex gap-2 text-quaternary bg-tertiary items-center mt-5 ${visualizationsMetric === 'low' ? 'border-green-500' :
        visualizationsMetric === 'medium' ? 'border-secondary' :
          'border-primary'
        }`}
    >
      <GraphicIcon fill={visualizationsMetric === 'low' ? "green" : visualizationsMetric === 'medium' ? "#F5BF5D" : "#F75D5F"} width="2.5rem" height="2.5rem" />
      <h3 className="text-xl font-bold">Muito visualizado!</h3>
      <p className="text-lg font-normal">Já foram {visualizations} acessos.</p>
    </section>
  )
}

export default VisualizationsBox