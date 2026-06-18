using System;

namespace LocalNet.API.Models;

public class Grupo
{
    public string? Id { get; set; } = Guid.NewGuid().ToString();

    public string? Nome { get; set; }

    public string? Descricao { get; set; }

    public DateTime CriadoEm { get; set; } = DateTime.Now;

    public DateTime AtualizadoEm { get; set; }

}
