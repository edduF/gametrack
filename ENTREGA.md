# Concluir a entrega da Etapa 1

## Estado deste pacote
Os arquivos HTML estão preparados. Este ZIP não comprova commits no repositório,
publicação no GitHub Pages nem criação da Release. Essas etapas ainda precisam
ser realizadas no repositório definido para o trabalho. O ZIP final do Canvas
deve ser baixado do GitHub somente após concluir e enviar as alterações.

## Repositório e commits
Trabalhe no repositório já definido. Preserve os arquivos e o histórico existentes.
Coloque o conteúdo desta pasta na raiz, para que `index.html` fique na raiz.
Não envie a pasta externa `gametrack` como uma subpasta da aplicação.

Revise os arquivos por partes e registre alterações coerentes, sem concentrar
os arquivos em um único commit. Uma sequência possível, após incorporar e revisar
cada parte no seu repositório, é:

```bash
git add index.html assets/
git commit -m "feat: adiciona estrutura inicial e listagem de jogos"
git add pages/cadastro.html
git commit -m "feat: adiciona formulario de cadastro de jogos"
git add pages/detalhes.html
git commit -m "feat: adiciona area de detalhes dos jogos"
git add README.md ENTREGA.md
git commit -m "docs: documenta escopo e entrega da etapa 1"
git push origin main
```

Use o nome real da branch principal caso não seja `main`. Os comandos acima
são instruções, não um histórico já executado. Não recrie nem apague o histórico
existente. Confira com `git status` e `git log --oneline`.

## GitHub Pages
Em Settings > Pages, selecione Deploy from a branch, a branch principal e
/(root). Salve e aguarde a publicação. Abra o endereço fornecido pelo GitHub.
Verifique a página inicial, Cadastrar jogo, os links de detalhes de cada jogo
e os links de retorno. Confirme que os campos e os três jogos estão visíveis.
Os controles sem JavaScript não precisam modificar dados nesta etapa.

## Release
Após verificar a publicação, acesse Releases > Draft a new release.
Crie a tag `v1.0.0` apontando para o commit final enviado e publicado.
Título: **Etapa 1 — HTML e Estrutura da Interface**.

Descrição sugerida (publique apenas depois de concluir a publicação):

- Estrutura HTML semântica do GameTrack.
- Formulário de cadastro da entidade Jogo.
- Listagem com três registros fictícios.
- Pesquisa, filtros, ordenação, edição e exclusão previstos na interface.
- Área de detalhes com navegação por jogo.
- Organização dos arquivos e documentação.
- Publicação inicial no GitHub Pages.

Publique a Release. Se fizer correções depois, assegure que tag, Pages e ZIP
voltem a corresponder exatamente à versão entregue.

## Canvas
Preencha com os links reais:

Repositório:
[URL do seu repositório]

GitHub Pages:
[URL fornecida pelo GitHub Pages]

Release v1.0.0:
[URL da Release publicada]

Após confirmar que a branch publicada e a tag apontam para a versão final,
use Code > Download ZIP no repositório. Anexe esse ZIP ao Canvas junto dos
três links. Não use este pacote preliminar como prova da publicação.
