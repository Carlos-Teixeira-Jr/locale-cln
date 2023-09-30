import { NextPageWithLayout } from './page';

const UserTerms: NextPageWithLayout = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex justify-center max-w-[1232px]">
        <div className="text-2xl m-auto">
          <div className="flex flex-col items-center mb-10 mt-2">
            <h1 className="font-bold mb-5">Termos de Uso</h1>
            <p className="text-center">
              Termos de uso Os seguintes termos podem ser mudados sem aviso
              prévio.
            </p>
            <p>
              Última atualização <b>21/02/2023</b>
            </p>
          </div>

          <div>
            <p>
              O Locale Imóveis é um site de anúncios para imóveis que permite
              que usuários cadastrem e anunciem seus imóveis. Ao utilizar o
              Locale Imóveis, você concorda com os seguintes termos de uso:
            </p>
          </div>

          <ul className="my-10">
            <li className="list-disc ml-4 mb-10">
              <div>
                <h2 className="font-bold">Cadastro e Login</h2>
                <p>
                  Para anunciar um imóvel no Locale Imóveis, você precisa se
                  cadastrar e fazer login. Ao se cadastrar, você concorda em
                  fornecer informações precisas e atualizadas sobre você e o
                  imóvel que deseja anunciar. Você também concorda em manter a
                  confidencialidade da sua senha e a responsabilidade por todas
                  as atividades que ocorrerem em sua conta.
                </p>
              </div>
            </li>

            <li className="list-disc ml-4 mb-10">
              <div>
                <h2 className="font-bold">Anúncios</h2>
                <p>
                  Os anúncios de imóveis no Locale Imóveis devem ser precisos e
                  representar o imóvel que está sendo anunciado. Ao criar um
                  anúncio, você concorda em fornecer informações precisas e
                  atualizadas sobre o imóvel, incluindo informações sobre o
                  preço, condições, localização e outras características
                  relevantes.
                </p>
              </div>
            </li>

            <li className="list-disc ml-4 mb-10">
              <div>
                <h2 className="font-bold">Propriedade intelectual</h2>
                <p>
                  O Locale Imóveis detém todos os direitos de propriedade
                  intelectual do site, incluindo o design, layout, gráficos e
                  conteúdo. Você concorda em não reproduzir, duplicar, copiar,
                  vender, revender ou explorar qualquer parte do site sem a
                  permissão expressa por escrito do Locale Imóveis.
                </p>
              </div>
            </li>

            <li className="list-disc ml-4 mb-10">
              <div>
                <h2 className="font-bold">Responsabilidade do Usuário</h2>
                <p>
                  Você é o único responsável por todas as informações fornecidas
                  no Locale Imóveis e pelo conteúdo de seus anúncios. Você
                  concorda em não utilizar o Locale Imóveis para qualquer
                  finalidade ilegal ou que viole direitos de terceiros. Você
                  também concorda em não usar o site para enviar spam,
                  propagandas ou outras comunicações não solicitadas.
                </p>
              </div>
            </li>

            <li className="list-disc ml-4 mb-10">
              <div>
                <h2 className="font-bold">Limitação de Responsabilidade</h2>
                <p>
                  O Locale Imóveis não se responsabiliza por qualquer perda ou
                  dano decorrente do uso do site, incluindo danos indiretos,
                  especiais, incidentais ou consequenciais. O Locale Imóveis não
                  garante a precisão ou a confiabilidade de qualquer informação
                  ou conteúdo disponível no site, incluindo os anúncios de
                  imóveis.
                </p>
              </div>
            </li>

            <li className="list-disc ml-4 mb-10">
              <div>
                <h2 className="font-bold">Modificações dos Termos de Uso</h2>
                <p>
                  O Locale Imóveis se reserva o direito de modificar estes
                  termos de uso a qualquer momento, sem aviso prévio. Ao
                  continuar a usar o Locale Imóveis após a publicação das
                  alterações, você concorda em cumprir os novos termos de uso.
                </p>
              </div>
            </li>

            <li className="list-disc ml-4 mb-10">
              <div>
                <h2 className="font-bold">Encerramento de Conta</h2>
                <p>
                  O Locale Imóveis se reserva o direito de encerrar a conta de
                  qualquer usuário que viole estes termos de uso ou que
                  apresente comportamento inadequado no site.
                </p>
              </div>
            </li>
          </ul>

          <div>
            <p>
              Ao utilizar o Locale Imóveis, você concorda com estes termos de
              uso. Se você não concorda com estes termos de uso, por favor, não
              use o Locale Imóveis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTerms;
