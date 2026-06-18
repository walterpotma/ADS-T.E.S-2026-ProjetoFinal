using System;

namespace LocalNet.API.Models;

public class UsuarioGrupo
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string? UsuarioId { get; set; }
    public string? GrupoId { get; set; }
}