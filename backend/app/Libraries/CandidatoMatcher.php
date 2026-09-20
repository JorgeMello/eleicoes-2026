<?php

namespace App\Libraries;

/**
 * Vincula nomes de pesquisa a candidatos.id por normalização.
 * Estratégia (conservadora, nesta ordem):
 *  1. igualdade normalizada (sem acento, minúsculas, espaços colapsados)
 *  2. tokens do nome de urna contidos nos tokens do nome da pesquisa
 *  3. tokens do nome da pesquisa contidos nos tokens do nome de urna
 * Fora isso: null (nome-livre, sem vínculo).
 */
class CandidatoMatcher
{
    public static function norm(string $s): string
    {
        $s = mb_strtolower(trim($s));
        // Mapa explícito (iconv//TRANSLIT varia por plataforma — no Windows gera "fl'avio")
        $mapa = [
            'á' => 'a', 'à' => 'a', 'ã' => 'a', 'â' => 'a', 'ä' => 'a',
            'é' => 'e', 'è' => 'e', 'ê' => 'e', 'ë' => 'e',
            'í' => 'i', 'ì' => 'i', 'î' => 'i', 'ï' => 'i',
            'ó' => 'o', 'ò' => 'o', 'õ' => 'o', 'ô' => 'o', 'ö' => 'o',
            'ú' => 'u', 'ù' => 'u', 'û' => 'u', 'ü' => 'u',
            'ç' => 'c', 'ñ' => 'n',
        ];
        $s = strtr($s, $mapa);
        $s = (string) iconv('UTF-8', 'ASCII//IGNORE', $s);
        $s = preg_replace('/[^a-z0-9 ]/', ' ', $s);
        return trim((string) preg_replace('/\s+/', ' ', $s));
    }

    /**
     * @param array<int, array{ id: int, nome: string }> $candidatos
     */
    public static function match(string $nomePesquisa, array $candidatos): ?int
    {
        $alvo = self::norm($nomePesquisa);
        if ($alvo === '') {
            return null;
        }

        foreach ($candidatos as $c) {
            if (self::norm($c['nome']) === $alvo) {
                return (int) $c['id'];
            }
        }

        $tokensAlvo = explode(' ', $alvo);
        foreach ($candidatos as $c) {
            $tokensCand = explode(' ', self::norm($c['nome']));
            if ($tokensCand === ['']) {
                continue;
            }
            $candEmAlvo = count(array_diff($tokensCand, $tokensAlvo)) === 0;
            $alvoEmCand = count(array_diff($tokensAlvo, $tokensCand)) === 0;
            if ($candEmAlvo || $alvoEmCand) {
                return (int) $c['id'];
            }
        }

        return null;
    }
}
