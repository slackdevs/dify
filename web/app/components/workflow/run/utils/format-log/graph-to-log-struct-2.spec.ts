import { parseDSL } from './graph-to-log-struct-2'

describe('parseDSL', () => {
  test('parse plain flow', () => {
    const dsl = 'a -> b -> c'
    const result = parseDSL(dsl)
    expect(result).toEqual([
      { nodeType: 'plain', nodeId: 'a' },
      { nodeType: 'plain', nodeId: 'b' },
      { nodeType: 'plain', nodeId: 'c' },
    ])
  })

  test('parse iteration node with flow', () => {
    const dsl = '(iteration, a, b -> c)'
    const result = parseDSL(dsl)
    expect(result).toEqual([
      {
        nodeType: 'iteration',
        nodeId: 'a',
        params: [
          [
            { nodeType: 'plain', nodeId: 'b' },
            { nodeType: 'plain', nodeId: 'c' },
          ],
        ],
      },
    ])
  })

  test('parse parallel node with flow', () => {
    const dsl = 'a -> (parallel, b, c -> d, e)'
    const result = parseDSL(dsl)
    expect(result).toEqual([
      {
        nodeType: 'plain',
        nodeId: 'a',
      },
      {
        nodeType: 'parallel',
        nodeId: 'b',
        params: [
          [
            { nodeType: 'plain', nodeId: 'c' },
            { nodeType: 'plain', nodeId: 'd' },
          ],
          // single node don't need to be wrapped in an array
          { nodeType: 'plain', nodeId: 'e' },
        ],
      },
    ])
  })

  test('parse retry', () => {
    const dsl = '(retry, a, 3)'
    const result = parseDSL(dsl)
    expect(result).toEqual([
      {
        nodeType: 'retry',
        nodeId: 'a',
        params: [3],
      },
    ])
  })

  test('parse nested complex nodes', () => {
    const dsl = '(iteration, a, b -> (parallel, e, f -> g, h))'
    const result = parseDSL(dsl)
    expect(result).toEqual([
      {
        nodeType: 'iteration',
        nodeId: 'a',
        params: [
          [
            { nodeType: 'plain', nodeId: 'b' },
            {
              nodeType: 'parallel',
              nodeId: 'e',
              params: [
                [
                  { nodeType: 'plain', nodeId: 'f' },
                  { nodeType: 'plain', nodeId: 'g' },
                ],
                // single node don't need to be wrapped in an array
                { nodeType: 'plain', nodeId: 'h' },
              ],
            },
          ],
        ],
      },
    ])
  })
})