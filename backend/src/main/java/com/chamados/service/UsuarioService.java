package com.chamados.service;

import com.chamados.domain.Usuario;
import com.chamados.dto.request.UsuarioRequestDTO;
import com.chamados.dto.response.UsuarioResponseDTO;
import com.chamados.exception.BusinessException;
import com.chamados.exception.ResourceNotFoundException;
import com.chamados.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder   passwordEncoder;

    // ── UserDetailsService (Spring Security) ─────────────────

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));
    }

    // ── CRUD ─────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> listar() {
        return usuarioRepository.findAll()
            .stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarPorId(Long id) {
        return toDTO(findOrThrow(id));
    }

    @Transactional
    public UsuarioResponseDTO criar(UsuarioRequestDTO dto) {
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new BusinessException("Já existe um usuário com o e-mail: " + dto.email());
        }
        Usuario usuario = Usuario.builder()
            .nome(dto.nome())
            .email(dto.email())
            .senha(passwordEncoder.encode(dto.senha()))
            .role(dto.role())
            .build();
        return toDTO(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioResponseDTO atualizar(Long id, UsuarioRequestDTO dto) {
        Usuario usuario = findOrThrow(id);

        // Verifica duplicidade de e-mail somente se mudou
        if (!usuario.getEmail().equalsIgnoreCase(dto.email())
                && usuarioRepository.existsByEmail(dto.email())) {
            throw new BusinessException("Já existe um usuário com o e-mail: " + dto.email());
        }

        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenha(passwordEncoder.encode(dto.senha()));
        usuario.setRole(dto.role());
        return toDTO(usuarioRepository.save(usuario));
    }

    @Transactional
    public void desativar(Long id) {
        Usuario usuario = findOrThrow(id);
        usuario.setAtivo(false);
        usuarioRepository.save(usuario);
    }

    @Transactional
    public UsuarioResponseDTO reativar(Long id) {
        Usuario usuario = findOrThrow(id);
        usuario.setAtivo(true);
        return toDTO(usuarioRepository.save(usuario));
    }

    // ── Internos ─────────────────────────────────────────────

    public Usuario findOrThrow(Long id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com ID: " + id));
    }

    private UsuarioResponseDTO toDTO(Usuario u) {
        return new UsuarioResponseDTO(
            u.getId(), u.getNome(), u.getEmail(),
            u.getRole().name(), u.isAtivo()
        );
    }
}
